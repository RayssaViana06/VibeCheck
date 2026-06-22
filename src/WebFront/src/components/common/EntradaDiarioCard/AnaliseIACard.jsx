import React from "react";
import "./AnaliseIACard.css";
import roboIcone from "../../../assets/roboIA.png";
import getCorEmocaoPT from "../../../utils/getCorEmocaoPT";
import ProgressBar from "../../../pages/PerfilPaciente/components/ProgressBar";

export default function AnaliseIACard({respostaIA}) {
  if (!respostaIA?.analiseIA) return null;

  const textoCompleto = respostaIA.texto;
  const emocaoPredominante = respostaIA.analiseIA.emocaoPredominante;
  const frasesAnalisadas = respostaIA.analiseIA.frases ?? [];
  const corEmocaoPredominante = getCorEmocaoPT(emocaoPredominante).corEmocao;
  const emocaoEmPT = getCorEmocaoPT(emocaoPredominante).emocaoEmPT;
  const frasesEmocaoPred = frasesAnalisadas.filter(
    (frase) => frase.emocao === emocaoPredominante,
  );
  frasesEmocaoPred.sort((a, b) => b.intensidade - a.intensidade);


  return (
    <div className="analiseCard">
      <div className="tituloCard">
        <img src={roboIcone} className="iconeRobo" />
        <h1>ANÁLISE DE IA</h1>
      </div>
      <div className="conteudoWrapper">
        <div className="emocaoPredGeral">
          <div
            style={{
              color: "white",
              marginTop: "18px",
              fontWeight: 600,
              backgroundColor: corEmocaoPredominante,
              padding: "4px 8px",
              display: "inline-block",
              borderRadius: "22px",
            }}
          >
            {emocaoEmPT}
          </div>
        </div>
        {frasesEmocaoPred.map((frase) => (
          <div key={frase.trecho}>
            <p className="trechoEmocao">"{frase.trecho}"</p>
            <div className="emocaoEIntensidade">
              <p className="emocaoPredTrecho">{getCorEmocaoPT(frase.emocao).emocaoEmPT}</p>
              <p className="emocaoPredTrecho"> - </p>
              <p className="intensidadeEmoTrecho">{frase.intensidade}</p>
            </div>
            <ProgressBar score={frase.intensidade} />
          </div>
        ))}
      </div>
    </div>
  );
}
