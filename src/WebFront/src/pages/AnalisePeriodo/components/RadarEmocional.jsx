import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import "./RadarEmocional.css"

// emocoes: array de objetos { emocao: string, intensidade: number (0-10) }
// Exemplo:
// [
//   { emocao: 'Alegria',  intensidade: 7.2 },
//   { emocao: 'Tristeza', intensidade: 4.5 },
//   { emocao: 'Raiva',    intensidade: 2.1 },
//   { emocao: 'Medo',     intensidade: 3.8 },
//   { emocao: 'Surpresa', intensidade: 5.0 },
//   { emocao: 'Nojo',     intensidade: 1.4 },
// ]

export default function RadarEmocional({ entradasNoIntervalo = [] }) {
  
    const sumIntensidadeAlegria = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.alegria,0);
    const sumIntensidadeMedo = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.medo,0);
    const sumIntensidadeNojo = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.nojo,0);
    const sumIntensidadeRaiva = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.raiva,0);
    const sumIntensidadeSurpresa = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.surpresa,0);
    const sumIntensidadeTristeza = entradasNoIntervalo.reduce((acumulador,valAtual)=>acumulador + valAtual.tristeza,0);

    const numEntradasVazias = entradasNoIntervalo.filter(({dataEntrada, alegria, medo, nojo, raiva, surpresa, tristeza})=> (alegria + medo + nojo + raiva + surpresa + tristeza) === 0).length
    const numEntradasValidas = entradasNoIntervalo.length - numEntradasVazias;

    const emocoes = [
        { emocao: 'Alegria', intensidade: (sumIntensidadeAlegria/numEntradasValidas)},
        { emocao: 'Medo', intensidade: (sumIntensidadeMedo/numEntradasValidas)},
        { emocao: 'Nojo', intensidade: (sumIntensidadeNojo/numEntradasValidas)},
        { emocao: 'Raiva', intensidade: (sumIntensidadeRaiva/numEntradasValidas)},
        { emocao: 'Surpresa', intensidade: (sumIntensidadeSurpresa/numEntradasValidas)},
        { emocao: 'Tristeza', intensidade: (sumIntensidadeTristeza/numEntradasValidas)},

    ]

  
    return (
    <div className="card">
      <h3>Perfil emocional do período</h3>
      <p className="subtituloRadar" style={{ fontSize: '12px', marginBottom: '16px' }}>
        distribuição média das emoções
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={emocoes} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid
            stroke="#e4daf5"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="emocao"
            tick={{
              fill: '#9e8cc5',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'Nunito, sans-serif',
            }}
          />
          <Radar
            name="Intensidade"
            dataKey="intensidade"
            stroke="#5c4ba0"
            strokeWidth={2}
            fill="#5c4ba0"
            fillOpacity={0.15}
            dot={{ fill: '#5c4ba0', r: 4 }}
          />
          <Tooltip
            formatter={(value) => [`${value.toFixed(1)}`, 'Intensidade média']}
            contentStyle={{
              background: '#faf7ff',
              border: '1px solid #ddd4f4',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#2e1f5e',
              fontFamily: 'Nunito, sans-serif',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <p
        className="subtextoInferior"
        style={{ fontSize: '10px', textAlign: 'center', marginTop: '8px', fontStyle: 'italic' }}
      >
        área = intensidade média da emoção no período
      </p>
    </div>
  )
}