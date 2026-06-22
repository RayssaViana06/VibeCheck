import { View, Text, StyleSheet, Dimensions } from "react-native";

const larguraTela = Dimensions.get('window').width;
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryLabel,
} from "victory-native";

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
    <View style={estilos.card}>
      <View style={estilos.tituloGrafico}>
        <Text style={estilos.titulo}>Frequência de registro</Text>
        <Text style={estilos.subtituloRadar}>
          entradas por semana no período
        </Text>
      </View>

      <VictoryChart
        width={larguraTela - 64}
        height={220}
        domainPadding={{ x: 20 }}
        padding={{ top: 30, bottom: 40, left: 20, right: 20 }}
      >
        <VictoryAxis
          tickFormat={(t) => t}
          style={{
            axis: { stroke: "transparent" },
            tickLabels: {
              fill: "#9e8cc5",
              fontSize: 11,
              fontFamily: "Nunito-Regular",
            },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryBar
          data={semanas}
          x="semana"
          y="entradas"
          cornerRadius={{ top: 6 }}
          labels={({ datum }) => datum.entradas}
          labelComponent={
            <VictoryLabel
              dy={-6}
              style={{ fill: "#5a4a80", fontSize: 11, fontWeight: "700", fontFamily: "Nunito-Bold" }}
            />
          }
          style={{
            data: {
              fill: ({ datum }) => getBarColor(datum, semanas),
              width: 28,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tituloGrafico: {
    marginBottom: 4,
  },
  titulo: {
    fontSize: 15,
    fontFamily: "Nunito-Bold",
    color: "#2e1f5e",
  },
  subtituloRadar: {
    fontSize: 12,
    fontFamily: "Nunito-Regular",
    color: "#9e8cc5",
    marginBottom: 16,
  },
});
