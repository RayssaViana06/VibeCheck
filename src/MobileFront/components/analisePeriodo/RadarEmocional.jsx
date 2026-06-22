import { View, Text, StyleSheet, Dimensions } from 'react-native';

const larguraTela = Dimensions.get('window').width;
import {
  VictoryChart,
  VictoryPolarAxis,
  VictoryArea,
} from 'victory-native';

export default function RadarEmocional({ entradasNoIntervalo = [] }) {

    const sumIntensidadeAlegria = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.alegria,0);
    const sumIntensidadeMedo = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.medo,0);
    const sumIntensidadeNojo = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.nojo,0);
    const sumIntensidadeRaiva = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.raiva,0);
    const sumIntensidadeSurpresa = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.surpresa,0);
    const sumIntensidadeTristeza = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.tristeza,0);

    const numEntradasVazias = entradasNoIntervalo.filter(({dataEntrada, alegria, medo, nojo, raiva, surpresa, tristeza})=> (alegria + medo + nojo + raiva + surpresa + tristeza) === 0).length
    const numEntradasValidas = (entradasNoIntervalo.length - numEntradasVazias) || 1;

    const emocoes = [
        { emocao: 'Alegria', intensidade: (sumIntensidadeAlegria/numEntradasValidas)},
        { emocao: 'Medo', intensidade: (sumIntensidadeMedo/numEntradasValidas)},
        { emocao: 'Nojo', intensidade: (sumIntensidadeNojo/numEntradasValidas)},
        { emocao: 'Raiva', intensidade: (sumIntensidadeRaiva/numEntradasValidas)},
        { emocao: 'Surpresa', intensidade: (sumIntensidadeSurpresa/numEntradasValidas)},
        { emocao: 'Tristeza', intensidade: (sumIntensidadeTristeza/numEntradasValidas)},
    ]

    const dadosGrafico = emocoes.map(e => ({ x: e.emocao, y: e.intensidade }));

    return (
    <View style={estilos.card}>
      <Text style={estilos.titulo}>Perfil emocional do período</Text>
      <Text style={estilos.subtituloRadar}>
        distribuição média das emoções
      </Text>

      <VictoryChart
        polar
        width={larguraTela - 64}
        height={280}
        domain={{ y: [0, 10] }}
        padding={{ top: 30, bottom: 30, left: 40, right: 40 }}
      >
        <VictoryPolarAxis
          dependentAxis
          style={{
            axis: { stroke: 'transparent' },
            grid: { stroke: '#e4daf5', strokeWidth: 1 },
            tickLabels: { fill: 'transparent' },
          }}
          tickValues={[2, 4, 6, 8, 10]}
        />
        <VictoryPolarAxis
          style={{
            axis: { stroke: '#e4daf5' },
            grid: { stroke: '#e4daf5', strokeWidth: 1 },
            tickLabels: {
              fill: '#9e8cc5',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'Nunito-Bold',
            },
          }}
        />
        <VictoryArea
          data={dadosGrafico}
          style={{
            data: {
              fill: '#5c4ba0',
              fillOpacity: 0.15,
              stroke: '#5c4ba0',
              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>
    </View>
  )
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    paddingBottom:32,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: '#2e1f5e',
  },
  subtituloRadar: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9e8cc5',
    marginBottom: 16,
  },

});
