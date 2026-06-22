import { Suspense } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
  ReferenceLine,
} from "recharts";

import "./GraficoBarrasFrequencia.css";

const COR_ESCURO = "#5c4ba0";
const COR_CLARO = "#ece6f8";

function getBarColor(entry, dados) {
  const maxEntradas = Math.max(...dados.map((d) => d.entradas));
  return entry.entradas === maxEntradas ? COR_ESCURO : COR_CLARO;
}

function filtrarDiasComEntradas(entradas) {
  return entradas.filter(
    ({ alegria, medo, nojo, raiva, surpresa, tristeza, neutro }) =>
      alegria + medo + nojo + raiva + surpresa + tristeza + neutro !== 0,
  );
}

function contarEntradasSemanas(entradasEmocoes) {
  const diasExtras = entradasEmocoes.length % 7;
  const numSemanas = Math.floor(entradasEmocoes.length / 7);
  const numEntradas = entradasEmocoes.length;
  if (numSemanas === 0) {
    const diasComEntrada = filtrarDiasComEntradas(entradasEmocoes);
    return [{ semana: "sem 1", entradas: diasComEntrada.length }];
  }
  const entradasSemanas = [];
  for (let i = 0; i < numSemanas; i++) {
    const semanaSelecionada = entradasEmocoes.slice(i * 7, 7 * (i + 1));
    const diasComEntrada = filtrarDiasComEntradas(semanaSelecionada);
    entradasSemanas.push({
      semana: `sem ${i + 1}`,
      entradas: diasComEntrada.length,
    });
  }

  if (diasExtras > 0) {
    const diasExtrasComEntrada = filtrarDiasComEntradas(
      entradasEmocoes.slice(-diasExtras),
    );
    entradasSemanas.push({
      semana: `sem ${numSemanas + 1}`,
      entradas: diasExtrasComEntrada.length,
    });
  }

  return entradasSemanas;
}

export default function GraficoBarrasFrequencia({ entradasNoIntervalo = [] }) {
  const semanas = contarEntradasSemanas(entradasNoIntervalo);
  return (
    <div className="card">
      <div className="tituloGrafico">
        <h3>Frequência de registro</h3>
        <p
          className="subtituloRadar"
          style={{ fontSize: "12px", marginBottom: "16px" }}
        >
          entradas por semana no período
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={semanas}
          margin={{ top: 20, right: 10, bottom: 0, left: -20 }}
          barCategoryGap="30%"
        >
          <XAxis
            dataKey="semana"
            axisLine={false}
            tickLine={false}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y + 12}
                textAnchor="middle"
                fontSize={11}
                fill="#9e8cc5"
                fontFamily="Nunito, sans-serif"
              >
                {payload.value}
              </text>
            )}
          />
          <YAxis hide />
          <Bar dataKey="entradas" radius={[6, 6, 0, 0]}>
            {semanas.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry, semanas)} />
            ))}
            <LabelList
              dataKey="entradas"
              position="top"
              style={{
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "Nunito, sans-serif",
                fill: "#5a4a80",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
