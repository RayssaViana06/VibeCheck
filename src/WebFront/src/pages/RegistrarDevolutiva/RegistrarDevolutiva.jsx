import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import NavbarPsicologo from "../../components/layout/NavbarPsicologo";
import "./RegistrarDevolutiva.css";
import { devolutivaService } from "../../services/devolutivaService";
import { api } from "../../services/api";

export default function RegistrarDevolutiva() {
  const { user } = useAuth();
  const { id: pacienteId } = useParams();
  const navigate = useNavigate();
  const [texto, setTexto] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const MAX = 2000;

  useEffect(() => {
    document.body.style.backgroundColor = "#ECE6F8";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    async function carregarPaciente() {
      try {
        const data = await api.get(`/gateway/auth/users`);
        const pacienteEncontrado = data.find(u => u.id === pacienteId || u._id === pacienteId);
        setPaciente(pacienteEncontrado);
      } catch (err) {
        console.error("Erro ao carregar paciente:", err);
      }
    }
    carregarPaciente();
  }, [pacienteId]);

  function handleCancelar() {
    navigate(`/perfil-paciente/${pacienteId}`);
  }

  async function handleEnviar() {
    if (loading) return;
    setErro("");

    if (!texto.trim()) {
      setErro("A devolutiva não pode ficar vazia.");
      return;
    }
    if (texto.trim().length < 5) {
      setErro("A devolutiva deve conter pelo menos 5 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await devolutivaService.criar({
        patientId: pacienteId,
        texto: texto,
        psicologoNome: user.name,
      });
      setSucesso(true);
      setTexto("");
      setTimeout(() => setSucesso(false), 2000);
    } catch (err) {
      console.error("Erro ao enviar devolutiva:", err);
      setErro(err.message || "Ocorreu um erro ao enviar a devolutiva.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rd-page">
      <NavbarPsicologo />

      <main className="rd-container">
        <button className="rd-voltar" onClick={handleCancelar}>
          ← voltar
        </button>

        <h1 className="rd-titulo">Registrar devolutiva</h1>
        <p className="rd-subtitulo">
          Envie uma observação sobre o andamento do tratamento
        </p>

        <div className="rd-paciente-card">
          <div className="rd-avatar">{paciente?.name?.charAt(0).toUpperCase() || "?"}</div>
          <div className="rd-paciente-info">
            <span className="rd-paciente-nome">{paciente?.name || "Carregando..."}</span>
            <span className="rd-paciente-entrada">última entrada: {paciente?.ultimaEntrada || "-"}</span>
          </div>
        </div>

        <div className="rd-campo">
          <label className="rd-label">Observação clínica</label>
          <p className="rd-label-sub">
            Será exibida ao paciente na seção Devolutivas.
          </p>
          <textarea
            className={`rd-textarea${erro ? " rd-textarea--erro" : ""}`}
            placeholder="Escreva sua devolutiva aqui..."
            maxLength={MAX}
            value={texto}
            onChange={(e) => { setTexto(e.target.value); setErro(""); }}
          />
          <div className="rd-textarea-footer">
            {erro
              ? <span className="rd-erro-inline">{erro}</span>
              : <span />
            }
            {texto.length > 0 && (
              <span className="rd-contador">{texto.length} / {MAX}</span>
            )}
          </div>
        </div>

        {loading && (
          <p className="rd-loading-hint">
            Enviando...
          </p>
        )}

        <div className="rd-acoes">
          <button className="rd-btn-cancelar" onClick={handleCancelar} disabled={loading}>
            Cancelar
          </button>
          <button className="rd-btn-enviar" onClick={handleEnviar} disabled={loading || !texto.trim()}>
            {loading ? "Enviando..." : "Enviar devolutiva"}
          </button>
        </div>
      </main>

      {sucesso && (
        <div className="rd-toast">
          Devolutiva enviada com sucesso!
        </div>
      )}
    </div>
  );
}