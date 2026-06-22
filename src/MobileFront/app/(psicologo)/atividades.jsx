import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import NavbarPsicologo from "../../components/NavbarPsicologo";
import Svg, { Path } from "react-native-svg";
import { useAuth } from "../../context/AuthContext";
import { linkService } from "../../services/linkService";
import { atividadeService } from "../../services/atividadeService";

function extrairNomeDireto(link) {
  return (
    link.pacienteNome ??
    link.patientName ??
    link.patient_name ??
    link.nome ??
    link.name ??
    null
  );
}

function extrairPacienteId(link) {
  return (
    link.pacienteId ??
    link.patientId ??
    link.patient_id ??
    link.userId ??
    link.id ??
    null
  );
}

export default function AtividadesPsicologo() {
  const { usuario: user } = useAuth();

  const [atividades, setAtividades] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [erroAtividades, setErroAtividades] = useState("");
  const [form, setForm] = useState({ pacienteId: "", texto: "", dataEntrega: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user) carregarDados();
  }, [user]);

  async function carregarDados() {
    setLoading(true);
    setErro("");
    setErroAtividades("");

    const psicologoId = user?.id ?? user?.sub ?? user?.userId;

    if (!psicologoId) {
      setErro("Não foi possível identificar o psicólogo. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      const atvsData = await atividadeService.getAtividades();
      console.log("Atividades retornadas:", JSON.stringify(atvsData));
      const lista = atvsData?.data ?? atvsData;
      setAtividades(Array.isArray(lista) ? lista : []);
    } catch (e) {
      console.error("[Atividades] Erro ao buscar atividades:", e.message);
      setErroAtividades("Não foi possível carregar as atividades.");
    }

    try {
      const linksData = await linkService.getPacientesByPsicologo(psicologoId);
      const links = Array.isArray(linksData) ? linksData : [];

      if (links.length === 0) {
        setPacientes([]);
        setLoading(false);
        return;
      }

      const pacientesResolvidos = await Promise.all(
        links.map(async (link) => {
          const pacId = extrairPacienteId(link);
          if (!pacId) return null;

          const nomeDireto = extrairNomeDireto(link);
          if (nomeDireto) return { id: pacId, nome: nomeDireto };

          try {
            const usuario = await linkService.getUsuarioInterno(pacId);
            return {
              id: pacId,
              nome:
                usuario?.name ??
                usuario?.nome ??
                usuario?.email ??
                `Paciente (${pacId})`,
            };
          } catch (e) {
            return { id: pacId, nome: `Paciente (${pacId})` };
          }
        })
      );

      const semNulos = pacientesResolvidos.filter(Boolean);
      const semDuplicatas = semNulos.filter(
        (p, idx, arr) =>
          arr.findIndex((x) => String(x.id) === String(p.id)) === idx
      );

      setPacientes(semDuplicatas);
    } catch (e) {
      console.error("[Atividades] Erro ao buscar vínculos:", e.message);
      setErro(`Erro ao carregar pacientes: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvar() {
    if (!form.pacienteId || !form.texto.trim()) {
      setErro("Preencha o paciente e a descrição da atividade.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      const psicologoId = user?.id ?? user?.sub ?? user?.userId;
      await atividadeService.criar({
        pacienteId: form.pacienteId,
        texto: form.texto,
        dataEntrega: form.dataEntrega
          ? new Date(form.dataEntrega).toISOString()
          : null,
        status: 0,
        estaConcluida: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setForm({ pacienteId: "", texto: "", dataEntrega: "" });
      setShowForm(false);
      await carregarDados();
    } catch (e) {
      setErro(`Erro ao criar atividade: ${e.message}`);
    } finally {
      setSalvando(false);
    }
  }

  async function handleToggle(atv) {
    const novoStatus = atv.status === 0 ? 1 : 0;
    setAtividades((prev) =>
      prev.map((a) => (a.id === atv.id ? { ...a, status: novoStatus } : a))
    );
    try {
      await atividadeService.atualizar(atv.id, { ...atv, status: novoStatus });
    } catch {
      setAtividades((prev) => prev.map((a) => (a.id === atv.id ? atv : a)));
    }
  }

  async function handleDeletar(id) {
    setAtividades((prev) => prev.filter((a) => a.id !== id));
    try {
      await atividadeService.deletar(id);
    } catch {
      await carregarDados();
    }
  }

  function getNomePaciente(pacienteId) {
    const p = pacientes.find((p) => String(p.id) === String(pacienteId));
    return p?.nome ?? "Paciente";
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
      <NavbarPsicologo />

      <ScrollView
        style={styles.main}
        contentContainerStyle={styles.mainContent}
      >
        
        <View style={styles.header}>
          <View>
            <Text style={styles.titulo}>Atividades</Text>
            <Text style={styles.subtitulo}>
              Gerencie as atividades dos seus pacientes
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btnNova}
            onPress={() => {
              setShowForm(true);
              setErro("");
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.btnNovaTexto}>+ Nova Atividade</Text>
          </TouchableOpacity>
        </View>

        
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Nova Atividade</Text>

            <Text style={styles.label}>Paciente</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.pacienteId}
                onValueChange={(val) => setForm({ ...form, pacienteId: val })}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um paciente" value="" />
                {pacientes.length === 0 && (
                  <Picker.Item
                    label="Nenhum paciente vinculado"
                    value=""
                    enabled={false}
                  />
                )}
                {pacientes.map((p) => (
                  <Picker.Item key={p.id} label={p.nome} value={p.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Descrição da Atividade</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Descreva a atividade..."
              placeholderTextColor="#b8a8e8"
              value={form.texto}
              onChangeText={(val) => setForm({ ...form, texto: val })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Data da Entrega</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text style={form.dataEntrega ? styles.dateText : styles.datePlaceholder}>
                {form.dataEntrega
                  ? new Date(form.dataEntrega).toLocaleDateString("pt-BR")
                  : "Selecione uma data"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={form.dataEntrega ? new Date(form.dataEntrega) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    setForm({ ...form, dataEntrega: selectedDate.toISOString() });
                  }
                }}
              />
            )}

            {!!erro && <Text style={styles.erro}>{erro}</Text>}

            <View style={styles.formAcoes}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => {
                  setShowForm(false);
                  setErro("");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSalvar, salvando && styles.btnSalvarDisabled]}
                onPress={handleSalvar}
                disabled={salvando}
                activeOpacity={0.8}
              >
                <Text style={styles.btnSalvarTexto}>
                  {salvando ? "Salvando..." : "Salvar Atividade"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!!erro && !showForm && <Text style={styles.erro}>{erro}</Text>}
        {!!erroAtividades && (
          <Text style={[styles.erro, { opacity: 0.75, fontSize: 12 }]}>
            ⚠️ {erroAtividades}
          </Text>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#5E499D"
            style={{ marginTop: 40 }}
          />
        ) : (
          <>
            {pendentes.map((atv) => (
              <CardAtividade
                key={atv.id}
                atv={atv}
                nomePaciente={getNomePaciente(atv.pacienteId)}
                dateInfo={formatarData(atv.dataEntrega)}
                onToggle={() => handleToggle(atv)}
                onDeletar={() => handleDeletar(atv.id)}
              />
            ))}

            {concluidas.length > 0 && (
              <>
                <Text style={styles.secao}>Concluídas</Text>
                {concluidas.map((atv) => (
                  <CardAtividade
                    key={atv.id}
                    atv={atv}
                    nomePaciente={getNomePaciente(atv.pacienteId)}
                    dateInfo={formatarData(atv.dataEntrega)}
                    onToggle={() => handleToggle(atv)}
                    onDeletar={() => handleDeletar(atv.id)}
                    concluida
                  />
                ))}
              </>
            )}

            {atividades.length === 0 && !erroAtividades && (
              <Text style={styles.vazio}>
                Nenhuma atividade cadastrada ainda.
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function CardAtividade({ atv, nomePaciente, dateInfo, onToggle, onDeletar, concluida }) {
  return (
    <View style={[styles.card, concluida && styles.cardConcluida]}>
      <TouchableOpacity
        style={[styles.checkbox, concluida && styles.checkboxChecked]}
        onPress={onToggle}
        activeOpacity={0.7}
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
          <Text style={styles.pacienteNome}>{nomePaciente}</Text>
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
              <Text style={[styles.data, dateInfo.urgente && styles.dataUrgente]}>
                {dateInfo.label}
              </Text>
            </View>
          )}
        </View>
      </View>

      
      
      <TouchableOpacity
        style={styles.btnDeletar}
        onPress={onDeletar}
        activeOpacity={0.7}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <Path
            d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 8h6.6l.7-8"
            stroke="#c5b8f0"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
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
  btnNova: {
    backgroundColor: "#2d1b6e",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  btnNovaTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  // Form
  formCard: {
    backgroundColor: "#ece8f7",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#b8a8e8",
    borderStyle: "dashed",
  },
  formTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2d1b6e",
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5E499D",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pickerWrapper: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#c5b8f0",
    backgroundColor: "#fff",
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    color: "#2d1b6e",
    fontSize: 14,
  },
  textarea: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#c5b8f0",
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#2d1b6e",
    padding: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    minHeight: 90,
  },
  dateInput: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#c5b8f0",
    backgroundColor: "#fff",
    padding: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#2d1b6e",
  },
  datePlaceholder: {
    fontSize: 14,
    color: "#b8a8e8",
  },
  formAcoes: {
    flexDirection: "row",
    gap: 12,
  },
  btnCancelar: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#c5b8f0",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  btnCancelarTexto: {
    color: "#5E499D",
    fontWeight: "700",
    fontSize: 14,
  },
  btnSalvar: {
    flex: 2,
    paddingVertical: 11,
    borderRadius: 24,
    backgroundColor: "#2d1b6e",
    alignItems: "center",
  },
  btnSalvarDisabled: {
    opacity: 0.6,
  },
  btnSalvarTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  // Lista
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
  // Card
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
  pacienteNome: {
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
  btnDeletar: {
    padding: 4,
    borderRadius: 6,
    marginLeft: 4,
  },
});