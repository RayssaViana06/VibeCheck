import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getHistorico } from "../../services/diarioService";
import { linkService } from "../../services/linkService";
import NavbarPaciente from "../../components/layout/NavbarPaciente";
import olaIcone from "../../assets/hello.png";
import iconeLateral from "../../assets/ratinho_meditando.png";
import iconeEscrever from "../../assets/journal.png";
import "./HomePaciente.css";

const MOCK = [
  {
    id: "1",
    texto:
      "hoje eu acordei bem animado, me senti leve pela primeira vez em semanas. fui trabalhar sem aquela sensação pesada no peito. almocei com um amigo e foi ótimo.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    texto:
      "dia bem pesado, tive uma reunião que me deixou esgotado e sem energia pro resto do dia.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    texto:
      "fui ao parque hoje, fazia tempo que não saía de casa assim. foi bom sentir o sol.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

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

export default function HomePaciente() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState([]);
  const [expandidos, setExpandidos] = useState({});
  const [loading, setLoading] = useState(true);

  // solicitações pendentes
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [respondendo, setRespondendo] = useState(false);
  const [nomePsicologo, setNomePsicologo] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHistorico();
        setEntradas(dados);
      } catch {
        setEntradas(MOCK);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [user]);

  useEffect(() => {
    async function carregarSolicitacoes() {
      try {
        if (!user?.id) return;
        const vinculos = await linkService.getVinculosByPaciente(user.id);
        const pendentes = vinculos.filter((v) => v.status === "pendente");
        setSolicitacoes(pendentes);

        if (pendentes.length > 0) {
          try {
            const psi = await linkService.getUsuarioInterno(
              pendentes[0].psicologoId,
            );
            setNomePsicologo(psi.name);
          } catch {
            setNomePsicologo("Psicólogo");
          }
        }
      } catch {}
    }
    carregarSolicitacoes();
  }, [user]);

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

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function toggleExpandir(id) {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const nome = user?.name?.split(" ")[0] ?? "Paciente";

  return (
    <div>
      <NavbarPaciente />

      <div className="home-hero">
        <div>
          <div className="nomePaciente" style={{ display: "flex", gap: 10 }}>
            <h1>Olá, {nome}</h1>
            <img
              src={olaIcone}
              alt=""
              style={{
                width: 32,
                height: 28,
                transform: "translate(0px, -3px)",
              }}
            />
          </div>
          <p>Como você está se sentindo hoje?</p>
        </div>

        {/* botão de solicitação no lugar da folha */}
        {solicitacoes.length > 0 ? (
          <button
            className="btn-solicitacao"
            onClick={() => setModalAberto(true)}
          >
            &#128276; {solicitacoes.length} solicitação
          </button>
        ) : (
          // <div className="hero-plant">&#127807;</div>
          <img src={iconeLateral} style={{ height: 78, width: 76, position:"absolute", top:12, right:20 }} />
        )}
      </div>

      {/* MODAL DE SOLICITAÇÃO */}
      {modalAberto && solicitacoes.length > 0 && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Solicitação de vínculo</h3>
              <button
                className="modal-fechar"
                onClick={() => setModalAberto(false)}
              >
                ✕
              </button>
            </div>
            <p className="modal-texto">
              <strong>{nomePsicologo}</strong> quer se vincular a você como seu
              psicólogo no VibeCheck.
            </p>
            <div className="modal-botoes">
              <button
                className="btn-recusar"
                onClick={() => handleResponder("recusar")}
                disabled={respondendo}
              >
                Recusar
              </button>
              <button
                className="btn-aceitar"
                onClick={() => handleResponder("aceitar")}
                disabled={respondendo}
              >
                {respondendo ? "..." : "Aceitar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="home-content">
        <button
          className="btn-nova-entrada"
          onClick={() => navigate("/nova-entrada")}
        >
          <img src={iconeEscrever} style={{width:26, height:26}}/>
          <div>Nova entrada no diário</div>
        </button>

        <div className="entradas-label">Suas entradas</div>

        {loading ? (
          <div className="loading-text">Carregando entradas...</div>
        ) : entradas.length === 0 ? (
          <div className="empty-state">
            Nenhuma entrada ainda. Que tal começar agora?
          </div>
        ) : (
          <>
            <div className="entradas-timeline">
              {entradas.map((entrada) => {
                const aberto = expandidos[entrada.id];
                const preview =
                  entrada.texto.slice(0, 55) +
                  (entrada.texto.length > 55 ? "..." : "");

                return (
                  <div className="entrada-row" key={entrada.id}>
                    <div className="entrada-dot" />
                    <div
                      className="entrada-card"
                      onClick={() => toggleExpandir(entrada.id)}
                    >
                      <div className="entrada-card-header">
                        <span className="entrada-data">
                          {formatarData(entrada.createdAt)}
                        </span>
                        <button
                          className="btn-toggle"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandir(entrada.id);
                          }}
                        >
                          {aberto ? "▲ recolher" : "▼ expandir"}
                        </button>
                      </div>
                      {!aberto ? (
                        <div className="entrada-preview">{preview}</div>
                      ) : (
                        <div className="entrada-full">{entrada.texto}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
