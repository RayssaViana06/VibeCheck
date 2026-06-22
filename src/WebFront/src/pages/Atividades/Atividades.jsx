import React, { useState, useEffect } from "react";
import Navbar from "../../components//layout/navbarPaciente";
import { atividadeService } from "../../services/atividadeService";
import { linkService } from "../../services/linkService";
import { useAuth } from "../../hooks/useAuth";
import "./Atividades.css";

export default function Atividades() {
  const { user } = useAuth();

  const [atividades, setAtividades] = useState([]);
  const [psicologaNome, setPsicologaNome] = useState(
    localStorage.getItem("psicologaNome") ?? "sua psicóloga"
  );
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

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

      
      console.log("Atividades:", atvsData);
      console.log("Vínculos:", linksData);

      setAtividades(Array.isArray(atvsData) ? atvsData : []);

      
      const links = Array.isArray(linksData) ? linksData : [];
      const vinculoAtivo = links.find(
        (l) => l.status === "aceito" || l.status === "ativo" || l.status === 1
      ) ?? links[0]; 

      if (vinculoAtivo) {
        const psicId =
          vinculoAtivo.psicologoId ?? vinculoAtivo.psychologistId ?? vinculoAtivo.psicId;

        
        const nomeNoVinculo =
          vinculoAtivo.psicologoNome ??
          vinculoAtivo.nome ??
          vinculoAtivo.psychologistName;

        if (nomeNoVinculo) {
          setPsicologaNome(nomeNoVinculo);
          localStorage.setItem("psicologaNome", nomeNoVinculo);
        } else if (psicId) {
          
          try {
            const psicologo = await linkService.getUsuarioInterno(psicId);
            console.log("Psicólogo interno:", psicologo);
            const nome = psicologo?.name ?? psicologo?.nome ?? "sua psicóloga";
            setPsicologaNome(nome);
            localStorage.setItem("psicologaNome", nome);
          } catch {
         
          }
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
                updatedAt: new Date().toISOString()
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
    <div className="atv-pac-page">
      <Navbar />

      <main className="atv-pac-main">
        <div className="atv-pac-header">
          <h1 className="atv-pac-titulo">Atividades</h1>
          <p className="atv-pac-subtitulo">Recomendadas por {psicologaNome}</p>
        </div>

        {erro && <p className="atv-pac-erro">{erro}</p>}

        {loading ? (
          <p className="atv-pac-vazio">Carregando suas atividades...</p>
        ) : (
          <>
            {pendentes.length > 0 && (
              <>
                <h3 className="atv-pac-secao">Pendentes</h3>
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
                <h3 className="atv-pac-secao">Concluídas</h3>
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
              <p className="atv-pac-vazio">
                Você ainda não tem atividades atribuídas. 😊
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function CardAtividadePaciente({ atv, psicologaNome, dateInfo, onConcluir, concluida }) {
  return (
    <div className={`atv-pac-card ${concluida ? "concluida" : ""}`}>
      <button
        className={`atv-pac-checkbox ${concluida ? "checked" : ""}`}
        onClick={onConcluir}
        title={concluida ? "Concluída" : "Marcar como concluída"}
        style={{ cursor: concluida ? "default" : "pointer" }}
      >
        {concluida && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7l3.5 3.5 5.5-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="atv-pac-card-body">
        <p className={`atv-pac-card-texto ${concluida ? "riscado" : ""}`}>
          {atv.texto}
        </p>
        <div className="atv-pac-card-meta">
          <span className="atv-pac-medico-nome">{psicologaNome}</span>
          {dateInfo && (
            <span className={`atv-pac-data ${dateInfo.urgente ? "urgente" : ""}`}>
              {dateInfo.urgente && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1L12 11.5H1L6.5 1Z" fill="#E8593C" />
                  <path
                    d="M6.5 5v3M6.5 9.5v.5"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
              {dateInfo.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
