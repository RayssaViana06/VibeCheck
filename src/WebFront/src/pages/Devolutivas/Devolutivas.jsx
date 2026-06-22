import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { devolutivaService } from "../../services/devolutivaService";
import logo_vibecheck_transparente from "../../assets/logo_vibecheck_transparente.png";
import NavbarPaciente from "../../components/layout/navbarPaciente";
import chat from "../../assets/chat.png";
import "./Devolutivas.css";

function formatarData(dataISO) {
  const data = new Date(dataISO);
  const hoje = new Date();

  if (data.toDateString() === hoje.toDateString()) {
    return `hoje, ${data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Devolutivas() {
  const { user } = useAuth();
  const [devolutivas, setDevolutivas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = "#ECE6F8";
    return () => { document.body.style.backgroundColor = ""; };
  }, []);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await devolutivaService.getMeus();
        setDevolutivas(data);
      } catch (err) {
        console.error("Erro ao carregar devolutivas:", err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function handleOcultar(id) {
    try {
      await devolutivaService.ocultar(id);
      setDevolutivas(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error("Erro ao ocultar devolutiva:", err);
    }
  }

  const maisRecente = devolutivas[0] || null;
  const anteriores = devolutivas.slice(1);

  return (
    <div className="dev-page">
      {/* <nav className="dev-navbar">
        <div className="dev-navbar-logo">
          <img src={logo_vibecheck_transparente} className="dev-navbar-img" alt="Logo vibecheck" />
          <h1 className="dev-navbar-titulo">VibeCheck</h1>
        </div>
        <div className="dev-navbar-btns">
          <a className="dev-nav-btn" href="/home">Diário</a>
          <a className="dev-nav-btn dev-nav-btn-ativo" href="/devolutivas">Devolutivas</a>
          <a className="dev-nav-btn" href="/atividades">Atividades</a>
          <a className="dev-nav-chat" href="/chat">
            <img src={chat} className="dev-nav-chat-icon" alt="chat" />
            <span>Chat</span>
          </a>
        </div>
      </nav> */}
      <NavbarPaciente/>

      <main className="dev-container">
        <h1 className="dev-titulo">Devolutivas</h1>
        <p className="dev-subtitulo">Mensagens do seu psicólogo sobre o tratamento</p>

        {carregando ? (
          <div className="dev-spinner-wrapper">
            <div className="dev-spinner" />
            <p className="dev-spinner-texto">Carregando devolutivas...</p>
          </div>
        ) : devolutivas.length === 0 ? (
          <div className="dev-vazio">Nenhuma devolutiva recebida ainda.</div>
        ) : (
          <>
            {maisRecente && (
              <>
                <span className="dev-secao-label">MAIS RECENTE</span>
                <div className="dev-card dev-card-destaque">
                  <div className="dev-card-header">
                    <div>
                      <span className="dev-psicologo-nome-destaque">
                        {maisRecente.psicologoNome?.toUpperCase() || "PSICÓLOGO"}
                      </span>
                      <span className="dev-data-destaque">{formatarData(maisRecente.createdAt || maisRecente.data)}</span>
                    </div>
                    {maisRecente.nova && <span className="dev-badge">nova</span>}
                  </div>
                  <p className="dev-texto-destaque">{maisRecente.texto}</p>
                </div>
              </>
            )}

            {anteriores.length > 0 && (
              <>
                <span className="dev-secao-label dev-secao-label-anteriores">ANTERIORES</span>
                <div className="dev-lista">
                  {anteriores.map((dev) => (
                    <div key={dev.id || dev._id} className="dev-card dev-card-anterior">
                      <button
                        className="dev-btn-excluir"
                        onClick={() => handleOcultar(dev.id)}
                      >
                        Excluir
                      </button>
                      <span className="dev-psicologo-nome">{dev.psicologoNome || "Psicólogo"}</span>
                      <span className="dev-data">{formatarData(dev.createdAt || dev.data)}</span>
                      <p className="dev-texto">{dev.texto}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}