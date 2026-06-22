import React from "react";
import { useState } from "react";
import iconeCalendario from "../../../assets/icone_calendario.png"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BarraSelecaoData.css";

export default function BarraSelecaoData({ dadosEntradaDiario, dataInicio, setDataInicio, dataFim, setDataFim, aplicarIntervalo, setEntradasNoIntervalo }) {
  const [ehPeriodoFixo, setEhPeriodoFixo] = useState(false);
  const [botaoSelecionado, setBotaoSelecionado] = useState(0);
  const dataLimiteInferior = new Date(
    dadosEntradaDiario[dadosEntradaDiario.length - 1].createdAt,
  );
  const dataLimiteSuperior = new Date(dadosEntradaDiario[0].createdAt);

  function selecionarIntervalo(dias) {
    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - dias + 1);
    setDataFim(fim);
    setDataInicio(inicio);
    setEhPeriodoFixo(true);
    setBotaoSelecionado(dias);
  }

  return (
    <div className="barraSelecaoDatas">
      <div className="selecaoDatas">
        <span className="labelPeriodo">Período:</span>
        <img className="iconeCalendario" src={iconeCalendario} />
        <DatePicker
          selected={ehPeriodoFixo ? null : dataInicio}
          onChange={(date) => {
            setBotaoSelecionado(0);
            setDataInicio(date);
            setEhPeriodoFixo(false);
            if(ehPeriodoFixo){
              setDataFim(date);
              setEhPeriodoFixo(false);
            }
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/AAAA"
          minDate={dataLimiteInferior}
          maxDate={dataLimiteSuperior > dataFim ? dataFim : dataLimiteSuperior}
        />
        <span>até</span>
        <img className="iconeCalendario" src={iconeCalendario} />
        <DatePicker
          selected={ehPeriodoFixo ? null : dataFim}
          onChange={(date) => {
            setDataFim(date);
            if(ehPeriodoFixo){
              setDataInicio(date);
              setEhPeriodoFixo(false);
            }
            setBotaoSelecionado(0);
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="DD/MM/AAAA"
          minDate={dataLimiteInferior}
          maxDate={dataLimiteSuperior}
        />
        <span
          className={`botaoPeriodoPredefinido ${botaoSelecionado === 7 ? "btn--ativo" : ""}`}
          onClick={() => selecionarIntervalo(7)}
        >
          7d
        </span>
        <span
          className={`botaoPeriodoPredefinido ${botaoSelecionado === 14 ? "btn--ativo" : ""}`}
          onClick={() => selecionarIntervalo(14)}
        >
          14d
        </span>
        <span
          className={`botaoPeriodoPredefinido ${botaoSelecionado === 30 ? "btn--ativo" : ""}`}
          onClick={() => selecionarIntervalo(30)}
        >
          30d
        </span>
      </div>
      <div className="botaoAplicarDatas" onClick={()=>aplicarIntervalo(dataInicio,dataFim,dadosEntradaDiario,setEntradasNoIntervalo)}>Aplicar</div>
    </div>
  );
}
