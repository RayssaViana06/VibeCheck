import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { diarioService } from "../../../services/diarioService";
import { useEffect, useState } from "react";
import { linkService } from "../../../services/linkService";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import LogoutButton from "../../../components/LogoutButton";

function formatarData(iso) {
  const data = new Date(iso);
  const agora = new Date();
  const diffDias = Math.floor((agora - data) / 86400000);
  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (diffDias === 0) return `hoje, ${hora}`;
  if (diffDias === 1) return `ontem, ${hora}`;
  const dia = data.getDate();
  const mes = data.toLocaleString("pt-BR", { month: "short" }).replace(".", "");
  return `${dia} ${mes}, ${hora}`;
}

const profileIcons = [
  require("../../../assets/images/profile-icon1.png"),
  require("../../../assets/images/profile-icon2.png"),
  require("../../../assets/images/profile-icon3.png"),
  require("../../../assets/images/profile-icon4.png"),
  require("../../../assets/images/profile-icon5.png"),
  require("../../../assets/images/profile-icon6.png"),
];

export default function DiarioScreen() {
  const { usuario, logout } = useAuth();
  const [entradas, setEntradas] = useState([]);
  const [expandidos, setExpandidos] = useState({});
  const [loading, setLoading] = useState(true);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [respondendo, setRespondendo] = useState(false);
  const [nomePsicologo, setNomePsicologo] = useState("");

  const iconeUsuario =
    profileIcons[usuario.userId.charCodeAt(0) % profileIcons.length];

  useFocusEffect(
    useCallback(() => {
      const buscarDiario = async () =>
        diarioService
          .getEntradasByPaciente(usuario.userId)
          .then((data) => {
            const entradas = (data ?? []).filter((e) => e.texto);
            setEntradas(entradas);
            setLoading(false);
          })
          .catch((err) => console.error("Erro ao carregar diário:", err));

      setLoading(true);
      buscarDiario();
    }, [usuario.userId]),
  );

  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        if (!usuario?.userId) return;
        const vinculos = await linkService.getVinculosByPaciente(
          usuario.userId,
        );
        const pendentes = vinculos.filter((v) => v.status === "pendente");
        setSolicitacoes(pendentes);
        if (pendentes.length > 0) {
          try {
            const psi = await linkService.getUsuarioInterno(
              pendentes[0].psicologoId,
            );
            setNomePsicologo(psi.name);
          } catch (err) {
            console.log("Erro solicitacoes 2:", err?.message);
            setNomePsicologo("Psicólogo");
          }
        }
      } catch (err) {
        console.log("Erro solicitacoes:", err?.message);
      }
    }
    carregarSolicitacoes();
  }, [usuario]);

  async function handleResponder(acao) {
    if (solicitacoes.length === 0 || respondendo) return;
    setRespondendo(true);
    try {
      await linkService.responderVinculo(solicitacoes[0].id, acao);
      setSolicitacoes((prev) => prev.slice(1));
      setModalAberto(false);
    } catch {
    } finally {
      setRespondendo(false);
    }
  }

  function toggleExpandir(id) {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleLogout() {
    logout();
    router.replace("/(auth)/login");
  }

  const nome = usuario?.name?.split(" ")[0] ?? "Paciente";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <View style={styles.navbarBrand}>
          <Text style={styles.navbarTitulo}>VibeCheck</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
        {/* <LogoutButton logoutRoute={"/(auth)/login"}/> */}
      </View>

      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Solicitação de vínculo</Text>
              <TouchableOpacity onPress={() => setModalAberto(false)}>
                <Ionicons name="close" size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTexto}>
              <Text style={{ fontWeight: "700" }}>{nomePsicologo}</Text> quer se
              vincular a você como seu psicólogo no VibeCheck.
            </Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.btnRecusar}
                onPress={() => handleResponder("recusar")}
                disabled={respondendo}
              >
                <Text style={styles.btnRecusarTexto}>Recusar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnAceitar}
                onPress={() => handleResponder("aceitar")}
                disabled={respondendo}
              >
                <Text style={styles.btnAceitarTexto}>
                  {respondendo ? "..." : "Aceitar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Image source={iconeUsuario} style={{ height: 50, width: 50 }} />
            <View>
              <Text style={styles.heroTitulo}>Olá, {nome}</Text>
              <Text style={styles.heroSubtitulo}>Como você está hoje?</Text>
            </View>
          </View>

          {solicitacoes.length > 0 ? (
            <TouchableOpacity
              style={styles.btnSino}
              onPress={() => setModalAberto(true)}
            >
              <Ionicons name="notifications" size={24} color="#fff" />
              <View style={styles.badge}>
                <Text style={styles.badgeTexto}>{solicitacoes.length}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Ionicons name="leaf" size={30} color="#fff" />
          )}
        </View>

        <TouchableOpacity
          style={styles.btnNovaEntrada}
          onPress={() => router.push("/diario/nova-entrada")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="pencil" size={18} color="#fff" />
            <Text style={styles.btnNovaEntradaTexto}>
              Nova entrada no diário
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.entradasLabel}>SUAS ENTRADAS</Text>

        {loading ? (
          <ActivityIndicator color="#5c4faa" style={{ marginTop: 24 }} />
        ) : entradas.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhuma entrada ainda. Que tal começar agora?
          </Text>
        ) : (
          <View style={styles.timeline}>
            {entradas.map((entrada, index) => {
              const entradaId = entrada._id || entrada.id;
              const aberto = expandidos[entradaId];
              const texto = entrada.texto ?? "";
              const preview =
                texto.slice(0, 60) + (texto.length > 60 ? "..." : "");
              const isLast = index === entradas.length - 1;

              return (
                <View key={entradaId} style={styles.entradaRow}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.dot} />
                    {!isLast && <View style={styles.linha} />}
                  </View>
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() => toggleExpandir(entradaId)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.cardData}>
                      {formatarData(entrada.createdAt)}
                    </Text>
                    {!aberto ? (
                      <Text style={styles.cardPreview}>{preview}</Text>
                    ) : (
                      <Text style={styles.cardFull}>{texto}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0eef8" },
  navbar: {
    backgroundColor: "#5c4faa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  navbarBrand: { flexDirection: "row", alignItems: "center", gap: 8 },
  navbarTitulo: { color: "#fff", fontSize: 16, fontWeight: "700" },
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
    alignItems: "center",
  },
  logoutBtn: { padding: 4 },
  content: { paddingBottom: 32 },
  hero: {
    backgroundColor: "#6b5cb8",
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTitulo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroSubtitulo: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
  btnSino: { position: "relative", padding: 4 },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#e07a5f",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTexto: { color: "#fff", fontSize: 10, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    width: "85%",
    gap: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitulo: { fontSize: 16, fontWeight: "700", color: "#2d2d2d" },
  modalTexto: { fontSize: 14, color: "#555", lineHeight: 22 },
  modalBotoes: { flexDirection: "row", gap: 12 },
  btnRecusar: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnRecusarTexto: { color: "#888", fontSize: 14, fontWeight: "700" },
  btnAceitar: {
    flex: 2,
    backgroundColor: "#5c4faa",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnAceitarTexto: { color: "#fff", fontSize: 14, fontWeight: "700" },
  btnNovaEntrada: {
    backgroundColor: "#e07a5f",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnNovaEntradaTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },
  entradasLabel: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#8a7bbf",
  },
  emptyText: {
    textAlign: "center",
    color: "#9b8fd4",
    marginTop: 24,
    fontSize: 14,
  },
  timeline: { paddingHorizontal: 16 },
  entradaRow: { flexDirection: "row", gap: 10, marginBottom: 0 },
  timelineLeft: { alignItems: "center", width: 14 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#5c4faa",
    marginTop: 16,
    zIndex: 1,
  },
  linha: {
    width: 2,
    flex: 1,
    backgroundColor: "#ccc4ea",
    marginTop: 2,
    marginBottom: -2,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(92,79,170,0.08)",
  },
  cardData: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5c4faa",
    marginBottom: 6,
  },
  cardPreview: { fontSize: 14, color: "#555", lineHeight: 20 },
  cardFull: { fontSize: 14, color: "#444", lineHeight: 22 },
});
