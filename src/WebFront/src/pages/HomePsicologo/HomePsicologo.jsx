import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { linkService } from "../../services/linkService";
import { diarioService } from "../../services/diarioService";
import NavbarPsicologo from "../../components/layout/NavbarPsicologo";
import ratinhofeliz from "../../assets/ratinhofeliz.png";
import iconeLateral from "../../assets/ratinho_meditando.png";
import "./HomePsicologo.css";
import { Brain, Sparkles } from "lucide-react";

export default function HomePsicologo() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [vinculos, setVinculos] = useState([]);
  const [stats, setStats] = useState({ pacientesAtivos: 0, entradasHoje: 0, naoLidas: 0 });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [cpfInput, setCpfInput] = useState("");
  const [modalEstado, setModalEstado] = useState("inicial");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalErro, setModalErro] = useState("");
  const [pacienteVinculado, setPacienteVinculado] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        if (!user?.id) return;

        const data = await linkService.getPacientesByPsicologo(user.id);
        const ativos = data.filter((v) => v.status === "ativo");

        const hoje = new Date().toDateString();

        const vinculosComDados = await Promise.all(
          ativos.map(async (vinculo) => {
            let pacienteNome = "Paciente";
            try {
              const paciente = await linkService.getUsuarioInterno(vinculo.pacienteId);
              pacienteNome = paciente.name;
            } catch {}

            let ultimaEntrada = null;
            let totalEntradas = 0;
            let entradasHojeCount = 0;
            try {
              const entradas = await diarioService.getEntradasByPaciente(vinculo.pacienteId);
              totalEntradas = entradas.length;
              entradasHojeCount = entradas.filter(
                (e) => new Date(e.createdAt).toDateString() === hoje
              ).length;
              if (entradas.length > 0) {
                const ordenadas = entradas.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
          })
        );

        const totalEntradasHoje = vinculosComDados.reduce(
          (total, vinculo) => total + vinculo.entradasHoje,
          0
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
    carregarDados();
  }, [user]);

  function abrirModal() {
    setCpfInput("");
    setModalEstado("inicial");
    setModalErro("");
    setPacienteVinculado(null);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  async function handleVincular() {
    if (!cpfInput.trim()) return;
    setModalLoading(true);
    setModalErro("");
    try {
      const result = await linkService.solicitarVinculo(cpfInput.replace(/\D/g, ""));
      setPacienteVinculado(result);
      setModalEstado("sucesso");
    } catch (err) {
      setModalEstado("erro");
      setModalErro("Nenhum paciente encontrado com esse CPF. Verifique o número e tente novamente.");
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div className="home-psi-page">

      {/* MODAL */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>

            {modalEstado === "inicial" && (
              <>
                <div className="modal-header">
                  <h3>Vincular paciente</h3>
                  <button className="modal-fechar" onClick={fecharModal}>✕</button>
                </div>
                <p className="modal-subtitulo">Digite o CPF do paciente para vincular</p>
                <div className="modal-input-row">
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpfInput}
                    onChange={(e) => setCpfInput(e.target.value)}
                    className="modal-input"
                  />
                  <button
                    className="modal-btn-buscar"
                    onClick={handleVincular}
                    disabled={modalLoading}
                  >
                    {modalLoading ? "..." : "Vincular"}
                  </button>
                </div>
                <p className="modal-aviso">O paciente precisa já ter uma conta cadastrada no VibeCheck.</p>
              </>
            )}

            {modalEstado === "erro" && (
              <>
                <div className="modal-header">
                  <h3>Vincular paciente</h3>
                  <button className="modal-fechar" onClick={fecharModal}>✕</button>
                </div>
                <p className="modal-subtitulo">Digite o CPF do paciente para vincular</p>
                <div className="modal-input-row">
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpfInput}
                    onChange={(e) => {
                      setCpfInput(e.target.value);
                      setModalEstado("inicial");
                    }}
                    className="modal-input modal-input-erro"
                  />
                  <button
                    className="modal-btn-buscar"
                    onClick={handleVincular}
                    disabled={modalLoading}
                  >
                    Vincular
                  </button>
                </div>
                <p className="modal-erro-msg">⚠ {modalErro}</p>
                <button className="modal-btn-fechar" onClick={fecharModal}>Fechar</button>
              </>
            )}

            {modalEstado === "sucesso" && (
              <>
                <div className="modal-sucesso-emoji">
                  <img src={ratinhofeliz} alt="Sucesso!" style={{ width: "80px", margin: "0 auto" }} />
                </div>
                <h3 className="modal-sucesso-titulo">Solicitação enviada!</h3>
                <p className="modal-sucesso-texto">
                  A solicitação de vínculo foi enviada. O paciente precisa aceitar para aparecer na sua lista.
                </p>
                <button className="modal-btn-confirmar" onClick={fecharModal}>
                  Fechar
                </button>
              </>
            )}

          </div>
        </div>
      )}

      {/* NAVBAR */}
      <NavbarPsicologo paginaAtiva="pacientes" />

      {/* HEADER DE BOAS-VINDAS */}
      <div className="home-psi-header">
        <div className="home-psi-header-content">
          <div>
            <h2 className="home-psi-saudacao">
           Olá, {user?.name ?? "Doutor(a)"} <Sparkles size={24} color="#FFD700" style={{ opacity: 0.9 }} />
           </h2>
            <p className="home-psi-subtitulo">
              Você tem {stats.naoLidas} novas entradas para revisar hoje.
            </p>
          </div>
          <div className="home-psi-header-icon">
            <img src={iconeLateral} style={{ height: 78, width: 76, position:"absolute", top:64, right:20 }} />
          </div>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="home-psi-content">
        <div className="home-psi-stats">
          <div className="home-psi-stat-card">
            <span className="home-psi-stat-num">{stats.pacientesAtivos}</span>
            <span className="home-psi-stat-label">pacientes ativos</span>
          </div>
          <div className="home-psi-stat-card">
            <span className="home-psi-stat-num">{stats.entradasHoje}</span>
            <span className="home-psi-stat-label">entradas hoje</span>
          </div>
          <div className="home-psi-stat-card">
            <span className="home-psi-stat-num">{stats.naoLidas}</span>
            <span className="home-psi-stat-label">não lidas</span>
          </div>
        </div>

        <div className="home-psi-timeline-section">
          <div className="home-psi-timeline-header">
            <h3 className="home-psi-timeline-titulo">SEUS PACIENTES</h3>
            <button className="home-psi-btn-vincular" onClick={abrirModal}>
              + Vincular paciente
            </button>
          </div>

          {loading && <p className="home-psi-loading">Carregando pacientes...</p>}
          {erro && <p className="home-psi-erro">{erro}</p>}
          {!loading && vinculos.length === 0 && (
            <p className="home-psi-vazio">Nenhum paciente vinculado ainda.</p>
          )}

          <div className="home-psi-timeline">
            <div className="home-psi-timeline-linha" />
            {vinculos.map((vinculo) => {
              const iniciais = vinculo.pacienteNome
                ? vinculo.pacienteNome.split(" ").map((n) => n[0]).slice(0, 2).join("")
                : "?";
              return (
                <div key={vinculo.id} className="home-psi-timeline-item">
                  <div className="home-psi-timeline-dot" />
                  <div
                    className="home-psi-entrada-card"
                    onClick={() => navigate(`/perfil-paciente/${vinculo.pacienteId}`)}
                  >
                    <div className="home-psi-entrada-paciente">
                      <div className="home-psi-avatar">{iniciais}</div>
                      <div>
                        <span className="home-psi-paciente-nome">{vinculo.pacienteNome}</span>
                        <span className="home-psi-entrada-data">
                          {vinculo.ultimaEntrada
                            ? `última entrada: ${new Date(vinculo.ultimaEntrada).toLocaleDateString("pt-BR")}`
                            : "nenhuma entrada ainda"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}