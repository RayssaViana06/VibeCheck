import React from "react";
import AnaliseIACard from "./AnaliseIACard";
import "./EntradaDiarioCard.css";
import getDataHoraEntrada from "../../../utils/getDataHoraEntrada";
import { useState } from "react";

export default function EntradaDiarioCard({ entrada, mostrarAnaliseIA = false, defaultAberto = false }) {

  const [abertoFechado, setAbertoFechado] = useState(defaultAberto);
  const { horaEntrada, dataEntrada } = getDataHoraEntrada(entrada);

  return (
    <div className="timelineItem">
      <div className="timelineCirculo" />
      <div className="entradaCard">
        <div className="cardTop">
          <span>{`${dataEntrada}, ${horaEntrada}`}</span>
          {
            abertoFechado &&
          <div
            className="expandirRecolher"
            onClick={() => setAbertoFechado((v) => !v)}
          >
            ⮝ recolher
          </div>
          }
          {
            !abertoFechado &&
          <div
            className="expandirRecolher"
            onClick={() => setAbertoFechado((v) => !v)}
          >
            ⮟ expandir
          </div>
          }

        </div>
        <p className="textoEntrada">{abertoFechado ? entrada.texto : ((entrada.texto ?? "").slice(0, 200) + "...")}</p>
        {(abertoFechado && mostrarAnaliseIA) && <AnaliseIACard respostaIA={entrada} />}
      </div>
    </div>
  );
}
