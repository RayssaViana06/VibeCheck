import React from "react";
import { getIntensidadeCor } from "../FuncoesAnalisePeriodo";
import "./GraficoHeatmap.css";

export default function GraficoHeatmap({ analiseEmocoes }) {
  return (
    <div className="graficoHeatmap">
      <h2 className="tituloHeatmap">Evolução emocional por dia</h2>
      <span className="subtituloHeatmap">
        emoção e intensidade de cada entrada - saturação = intensidade
      </span>
      <div className="heatmap">
        <div className="legendasHeatmap">
          <div>Alegria</div>
          <div>Tristeza</div>
          <div>Raiva</div>
          <div>Medo</div>
          <div>Surpresa</div>
          <div>Nojo</div>
        </div>
        <div className="planoHeatmap">
          {analiseEmocoes.map((emocoesEntradaDia) => {
            const cores = getIntensidadeCor(emocoesEntradaDia);
            return (
              <div className="colunaHeatmap" key={emocoesEntradaDia.dataEntrada}>
                <span className="legendaDiaHeatmap">
                  {emocoesEntradaDia.dataEntrada}
                </span>
                <div style={{ backgroundColor: cores.intesidadeCorAlegria ?? undefined }}>&nbsp;</div>
                <div style={{ backgroundColor: cores.intesidadeCorTristeza ?? undefined }}>&nbsp;</div>
                <div style={{ backgroundColor: cores.intesidadeCorRaiva ?? undefined }}>&nbsp;</div>
                <div style={{ backgroundColor: cores.intesidadeCorMedo ?? undefined }}>&nbsp;</div>
                <div style={{ backgroundColor: cores.intesidadeCorSurpresa ?? undefined }}>&nbsp;</div>
                <div style={{ backgroundColor: cores.intesidadeCorNojo ?? undefined }}>&nbsp;</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
