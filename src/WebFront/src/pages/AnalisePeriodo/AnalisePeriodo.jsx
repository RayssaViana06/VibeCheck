import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavbarPsicologo from "../../components/layout/NavbarPsicologo";
import InfoPacienteFoto from "../../components/common/infoPacenteFoto";
import BarraSelecaoData from "./components/BarraSelecaoData";
import GraficoHeatmap from "./components/GraficoHeatmap";
import RadarEmocional from "./components/RadarEmocional";
import "./AnalisePeriodo.css";
import {
  limparUmDiarioHeatmap,
  filtrarIntervalo,
  nDiasAtras,
  aplicarIntervalo,
} from "./FuncoesAnalisePeriodo";
import GraficoBarrasFrequencia from "./components/GraficoBarrasFrequencia";

export default function AnalisePeriodo() {
  const { state } = useLocation();
  const entradas = state?.entradas ?? [];
  const dataHoje = new Date();
  const [entradasNoIntervalo, setEntradasNoIntervalo] = useState([]);
  const [inicioPeriodo, setInicioPeriodo] = useState(nDiasAtras(dataHoje, 7));
  const [dataInicio, setDataInicio] = useState();
  const [dataFim, setDataFim] = useState();
  const [intervalo, setIntervalo] = useState({
    inicio: dataHoje,
    fim: dataHoje,
  });

  console.log(entradasNoIntervalo);

  return (
    <div className="wrapperPagina">
      <NavbarPsicologo />
      <InfoPacienteFoto numEntradas={entradas.length} />
      <BarraSelecaoData
        dadosEntradaDiario={entradas}
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        setIntervalo={setIntervalo}
        aplicarIntervalo={aplicarIntervalo}
        setEntradasNoIntervalo={setEntradasNoIntervalo}
      />
      <div className="containerGraficos">
        <GraficoHeatmap className="graficoHeatmap" analiseEmocoes={entradasNoIntervalo} />
        <RadarEmocional className="radarEmocional" entradasNoIntervalo={entradasNoIntervalo} />
        <GraficoBarrasFrequencia className="graficoBarras" entradasNoIntervalo={entradasNoIntervalo} />
      </div>
    </div>
  );
}
