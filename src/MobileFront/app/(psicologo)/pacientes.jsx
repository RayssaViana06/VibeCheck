import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { linkService } from "../../services/linkService";
import { diarioService } from "../../services/diarioService";
import LogoutButton from "../../components/LogoutButton";

export default function PacientesScreen() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [vinculos, setVinculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [stats, setStats] = useState({
    pacientesAtivos: 0,
    entradasHoje: 0,
    naoLidas: 0,
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [cpfInput, setCpfInput] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalErro, setModalErro] = useState("");
  const [modalSucesso, setModalSucesso] = useState(false);

  useEffect(() => {
    carregarPacientes();
  }, []);

  async function carregarPacientes() {
    try {
      const data = await linkService.getPacientesByPsicologo(usuario.userId);
      const ativos = data.filter((v) => v.status === "ativo");
      const hoje = new Date().toDateString();

      const vinculosComDados = await Promise.all(
        ativos.map(async (vinculo) => {
          let pacienteNome = "Paciente";
          try {
            const paciente = await linkService.getUsuarioInterno(
              vinculo.pacienteId,
            );
            pacienteNome = paciente.name;
          } catch {}

          let ultimaEntrada = null;
          let totalEntradas = 0;
          let entradasHojeCount = 0;
          try {
            const entradas = await diarioService.getEntradasByPaciente(
              vinculo.pacienteId,
            );
            totalEntradas = entradas.length;
            entradasHojeCount = entradas.filter(
              (e) => new Date(e.createdAt).toDateString() === hoje,
            ).length;
            if (entradas.length > 0) {
              const ordenadas = entradas.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
              );
              ultimaEntrada = ordenadas[0].createdAt;
            }
          } catch {}

          return {
            ...vinculo,
            pacienteNome,
            ultimaEntrada,
            totalEntradas,
            entradasHoje: entradasHojeCount,
          };
        }),
      );

      const totalEntradasHoje = vinculosComDados.reduce(
        (total, v) => total + v.entradasHoje,
        0,
      );

      setVinculos(vinculosComDados);
      setStats({
        pacientesAtivos: vinculosComDados.length,
        entradasHoje: totalEntradasHoje,
        naoLidas: totalEntradasHoje,
      });
    } catch (err) {
      setErro("Erro ao carregar pacientes.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVincular() {
    if (!cpfInput.trim()) return;
    setModalLoading(true);
    setModalErro("");
    try {
      await linkService.solicitarVinculo(cpfInput.replace(/\D/g, ""));
      setModalSucesso(true);
    } catch (err) {
      setModalErro("Nenhum paciente encontrado com esse CPF.");
    } finally {
      setModalLoading(false);
    }
  }

  function fecharModal() {
    setModalAberto(false);
    setModalSucesso(false);
    setCpfInput("");
    setModalErro("");
  }

  function handleLogout() {
    logout();
    router.replace("/(auth)/login");
  }

  function getIniciais(nome) {
    return nome
      ? nome
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?";
  }

  function formatarUltimaEntrada(dataStr) {
    if (!dataStr) return null;
    const data = new Date(dataStr);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    const hora = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (data.toDateString() === hoje.toDateString()) return `hoje, ${hora}`;
    if (data.toDateString() === ontem.toDateString()) return `ontem, ${hora}`;
    return (
      data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) +
      `, ${hora}`
    );
  }

  const cores = ["#6b3fa0", "#9b59b6", "#8e44ad", "#7d3c98", "#a569bd"];
  function getCorAvatar(nome) {
    const idx = nome ? nome.charCodeAt(0) % cores.length : 0;
    return cores[idx];
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navbar}>
          <Text style={styles.navTitulo}>VibeCheck</Text>
          {/* <TouchableOpacity onPress={handleLogout} style={styles.navSairBtn}>
            <Text style={styles.navSairTexto}>Sair</Text>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity> */}
          <LogoutButton logoutRoute={"/(auth)/login"}/>

        </View>
        <View style={styles.saudacaoRow}>
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.saudacao}>
                Olá, {usuario?.name ?? "Doutor(a)"}
              </Text>
              <Ionicons
                name="hand-right-outline"
                size={22}
                color="rgba(255,255,255,0.9)"
              />
            </View>
            <Text style={styles.subtitulo}>
              {stats.naoLidas} novas entradas hoje.
            </Text>
          </View>
          <Ionicons
            name="medical-outline"
            size={48}
            color="rgba(255,255,255,0.25)"
          />
        </View>
      </View>

      <FlatList
        data={vinculos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{stats.pacientesAtivos}</Text>
                <Text style={styles.statLabel}>pacientes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{stats.entradasHoje}</Text>
                <Text style={styles.statLabel}>entradas</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNum}>{stats.naoLidas}</Text>
                <Text style={styles.statLabel}>não lidas</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnVincular}
              onPress={() => setModalAberto(true)}
            >
              <Text style={styles.btnVincularTexto}>+ Vincular paciente</Text>
            </TouchableOpacity>

            <Text style={styles.secaoTitulo}>Seus pacientes</Text>

            {loading && (
              <ActivityIndicator color="#6b3fa0" style={{ marginTop: 20 }} />
            )}
            {erro ? <Text style={styles.erro}>{erro}</Text> : null}
            {!loading && vinculos.length === 0 && (
              <Text style={styles.vazio}>Nenhum paciente vinculado ainda.</Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const ultimaFormatada = formatarUltimaEntrada(item.ultimaEntrada);
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push(
                  `/(psicologo)/perfil-paciente?id=${item.pacienteId}`,
                )
              }
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: getCorAvatar(item.pacienteNome) },
                ]}
              >
                <Text style={styles.avatarTexto}>
                  {getIniciais(item.pacienteNome)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardNome}>{item.pacienteNome}</Text>
                {ultimaFormatada ? (
                  <Text style={styles.cardSub}>{ultimaFormatada}</Text>
                ) : (
                  <Text style={styles.cardSub}>nenhuma entrada ainda</Text>
                )}
              </View>
              <Text style={styles.seta}>›</Text>
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={modalAberto} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!modalSucesso ? (
              <>
                <Text style={styles.modalTitulo}>Vincular paciente</Text>
                <Text style={styles.modalSubtitulo}>
                  Digite o CPF do paciente
                </Text>
                <TextInput
                  style={[styles.input, modalErro ? styles.inputErro : null]}
                  placeholder="000.000.000-00"
                  value={cpfInput}
                  onChangeText={setCpfInput}
                  keyboardType="numeric"
                />
                {modalErro ? (
                  <Text style={styles.modalErro}>⚠ {modalErro}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.btnModal}
                  onPress={handleVincular}
                  disabled={modalLoading}
                >
                  {modalLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnModalTexto}>Vincular</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={fecharModal}>
                  <Text style={styles.modalFechar}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Image
                  source={require("../../assets/images/ratinhofeliz.png")}
                  style={styles.modalSucessoImg}
                />
                <Text style={styles.modalTitulo}>Solicitação enviada!</Text>
                <Text style={styles.modalSubtitulo}>
                  O paciente precisa aceitar para aparecer na sua lista.
                </Text>
                <TouchableOpacity style={styles.btnModal} onPress={fecharModal}>
                  <Text style={styles.btnModalTexto}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f0ff" },

  header: {
    backgroundColor: "#5E499D",
    paddingBottom: 0,
  },

  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  navTitulo: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  navSairBtn: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#7c66c0",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    alignItems:"center"
  },
  navSairTexto: { color: "rgba(255,255,255,0.75)", fontSize: 14 },

  saudacaoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: "#7c66c0",
  },
  saudacao: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitulo: { fontSize: 14, color: "rgba(255,255,255,0.75)", marginTop: 4 },

  corpo: { flex: 1 },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#EDE8F8",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statNum: { fontSize: 28, fontWeight: "bold", color: "#3d2970" },
  statLabel: {
    fontSize: 12,
    color: "#7b6fa0",
    marginTop: 4,
    textAlign: "center",
  },

  btnVincular: {
    backgroundColor: "#6b3fa0",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
  },
  btnVincularTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d2150",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cardNome: { fontSize: 16, fontWeight: "bold", color: "#1a1030" },
  cardSub: { fontSize: 12, color: "#999", marginTop: 2 },
  seta: { fontSize: 24, color: "#ccc", fontWeight: "bold" },

  erro: { color: "red", textAlign: "center", marginTop: 12 },
  vazio: { color: "#888", textAlign: "center", marginTop: 20 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 24 },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  modalSubtitulo: { fontSize: 14, color: "#888", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#e0d6f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 8,
  },
  inputErro: { borderColor: "red" },
  modalErro: { color: "red", fontSize: 13, marginBottom: 12 },
  btnModal: {
    backgroundColor: "#6b3fa0",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnModalTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalFechar: { color: "#888", textAlign: "center", marginTop: 12 },
  modalSucessoImg: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 12,
  },
});
