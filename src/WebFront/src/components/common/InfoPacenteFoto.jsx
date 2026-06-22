import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./InfoPacienteFoto.css";
import fotoPaciente from "../../assets/profile_img_1.png";
import { linkService } from "../../services/linkService";

function formatarMesAno(dataStr) {
  if (!dataStr) return "";
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

export default function InfoPacienteFoto({ mostrarBotaoDevolutiva = false, numEntradas }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    if (!id) return;
    linkService.getUsuarioInterno(id)
      .then(setPaciente)
      .catch((err) => console.error("Erro ao carregar dados do paciente:", err));
  }, [id]);

  return (
    <div className="infoBar">
      <div className="infoBarEsquerda">
        <div className="fotoInfoPaciente">
          <img src={fotoPaciente} className="fotoPaciente" />
        </div>
        <div className="infoPaciente">
          <h2 className="nomePaciente">{paciente?.name ?? "—"}</h2>
          {paciente?.createdAt && (
            <span className="tempoCadastrado">paciente desde {formatarMesAno(paciente.createdAt)}</span>
          )}
          {numEntradas != null && (
            <span className="numEntradas">{numEntradas} {numEntradas === 1 ? "entrada" : "entradas"}</span>
          )}
        </div>
      </div>

      {mostrarBotaoDevolutiva && (
        <div className="botaoDevolutiva" onClick={() => navigate(`/registrar-devolutiva/${id}`)}>
          <h1 className="textoBotaoDevolutiva">+ Registrar devolutiva</h1>
        </div>
      )}
    </div>
  );
}
