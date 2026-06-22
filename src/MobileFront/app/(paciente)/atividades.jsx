import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";
import { atividadeService } from "../../services/atividadeService";
import { linkService } from "../../services/linkService";
import { useAuth } from "../../context/AuthContext";
import NavbarPaciente from "../../components/NavbarPaciente";

export default function Atividades() {
  const { usuario: user } = useAuth();

  const [atividades, setAtividades] = useState([]);
  const [psicologaNome, setPsicologaNome] = useState("sua psicóloga");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function init() {
      const nomeSalvo = await AsyncStorage.getItem("psicologaNome");
      if (nomeSalvo) setPsicologaNome(nomeSalvo);
    }
    init();
  }, []);

  useEffect(() => {
    if (user) carregarDados();
  }, [user]);

  async function carregarDados() {
    setLoading(true);
    setErro("");
    try {
      const pacienteId = user?.id ?? user?.sub ?? user?.userId;

      const [atvsData, linksData] = await Promise.all([
        atividadeService.getAtividadesPaciente(pacienteId),
        linkService.getVinculosByPaciente(pacienteId).catch(() => []),
      ]);

      const lista = atvsData?.data ?? atvsData;
      setAtividades(Array.isArray(lista) ? lista : []);

      const links = Array.isArray(linksData) ? linksData : [];
      const vinculoAtivo =
        links.find(
          (l) => l.status === "aceito" || l.status === "ativo" || l.status === 1
        ) ?? links[0];

      if (vinculoAtivo) {
        const psicId =
          vinculoAtivo.psicologoId ??
          vinculoAtivo.psychologistId ??
          vinculoAtivo.psicId;

        const nomeNoVinculo =
          vinculoAtivo.psicologoNome ??
          vinculoAtivo.nome ??
          vinculoAtivo.psychologistName;

        if (nomeNoVinculo) {
          setPsicologaNome(nomeNoVinculo);
          await AsyncStorage.setItem("psicologaNome", nomeNoVinculo);
        } else if (psicId) {
          try {
            const psicologo = await linkService.getUsuarioInterno(psicId);
            const nome = psicologo?.name ?? psicologo?.nome ?? "sua psicóloga";
            setPsicologaNome(nome);
            await AsyncStorage.setItem("psicologaNome", nome);
          } catch {}
        }
      }
    } catch (e) {
      console.error("Erro ao carregar atividades:", e);
      setErro("Erro ao carregar atividades. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConcluir(atv) {
    if (atv.status === 1) return;
    const atualizada = { ...atv, status: 1, estaConcluida: true };
    setAtividades((prev) =>
      prev.map((a) => (a.id === atv.id ? atualizada : a))
    );
    try {
      await atividadeService.atualizarPaciente(atv.id, {
        pacienteId: atv.pacienteId,
        psicologoId: atv.psicologoId,
        texto: atv.texto,
        dataEntrega: atv.dataEntrega,
        status: 1,
        estaConcluida: true,
        createdAt: atv.createdAt,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      setAtividades((prev) =>
        prev.map((a) => (a.id === atv.id ? atv : a))
      );
    }
  }

  function formatarData(dateStr) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    const diff = (d - hoje) / 86400000;
    if (diff === 0) return { label: "entrega: hoje", urgente: true };
    if (diff < 0)
      return {
        label: `entregue: ${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`,
        urgente: false,
      };
    return {
      label: `entrega: ${d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`,
      urgente: false,
    };
  }

  const pendentes = atividades.filter((a) => a.status === 0);
  const concluidas = atividades.filter((a) => a.status === 1);

  return (
    <View style={styles.page}>
      <NavbarPaciente/>
      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.mainContent}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Atividades</Text>
          <Text style={styles.subtitulo}>Recomendadas por {psicologaNome}</Text>
        </View>

        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#5E499D"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {pendentes.length > 0 && (
              <>
                <Text style={styles.secao}>Pendentes</Text>
                {pendentes.map((atv) => (
                  <CardAtividadePaciente
                    key={atv.id}
                    atv={atv}
                    psicologaNome={psicologaNome}
                    dateInfo={formatarData(atv.dataEntrega)}
                    onConcluir={() => handleConcluir(atv)}
                  />
                ))}
              </>
            )}

            {concluidas.length > 0 && (
              <>
                <Text style={styles.secao}>Concluídas</Text>
                {concluidas.map((atv) => (
                  <CardAtividadePaciente
                    key={atv.id}
                    atv={atv}
                    psicologaNome={psicologaNome}
                    dateInfo={formatarData(atv.dataEntrega)}
                    onConcluir={() => {}}
                    concluida
                  />
                ))}
              </>
            )}

            {atividades.length === 0 && (
              <Text style={styles.vazio}>
                Você ainda não tem atividades atribuídas. 
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CardAtividadePaciente({
  atv,
  psicologaNome,
  dateInfo,
  onConcluir,
  concluida,
}) {
  return (
    <View style={[styles.card, concluida && styles.cardConcluida]}>
      <TouchableOpacity
        style={[styles.checkbox, concluida && styles.checkboxChecked]}
        onPress={onConcluir}
        disabled={concluida}
        activeOpacity={concluida ? 1 : 0.7}
      >
        {concluida && (
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path
              d="M2.5 7l3.5 3.5 5.5-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </TouchableOpacity>

      <View style={styles.cardBody}>
        <Text style={[styles.cardTexto, concluida && styles.cardTextoRiscado]}>
          {atv.texto}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.medicoNome}>{psicologaNome}</Text>
          {dateInfo && (
            <View style={styles.dataRow}>
              {dateInfo.urgente && (
                <Svg
                  width={13}
                  height={13}
                  viewBox="0 0 13 13"
                  fill="none"
                  style={{ marginRight: 4 }}
                >
                  <Path d="M6.5 1L12 11.5H1L6.5 1Z" fill="#E8593C" />
                  <Path
                    d="M6.5 5v3M6.5 9.5v.5"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </Svg>
              )}
              <Text
                style={[styles.data, dateInfo.urgente && styles.dataUrgente]}
              >
                {dateInfo.label}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f4f2f9",
  },
  main: {
    flex: 1,
  },
  mainContent: {
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
    padding: 16,
    paddingTop: 32,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2d1b6e",
  },
  subtitulo: {
    marginTop: 4,
    color: "#8b7fc7",
    fontSize: 13,
  },
  secao: {
    fontSize: 16,
    fontWeight: "800",
    color: "#5E499D",
    marginTop: 24,
    marginBottom: 12,
  },
  vazio: {
    color: "#8b7fc7",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 40,
  },
  erro: {
    color: "#c0392b",
    fontSize: 13,
    marginVertical: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  cardConcluida: {
    opacity: 0.65,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#c5b8f0",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: "#5E499D",
    borderColor: "#5E499D",
  },
  cardBody: {
    flex: 1,
    marginLeft: 14,
  },
  cardTexto: {
    fontSize: 14,
    color: "#2d1b6e",
    lineHeight: 21,
    marginBottom: 6,
  },
  cardTextoRiscado: {
    textDecorationLine: "line-through",
    color: "#8b7fc7",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  medicoNome: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5E499D",
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  data: {
    fontSize: 12,
    color: "#8b7fc7",
  },
  dataUrgente: {
    color: "#c0392b",
  },
});