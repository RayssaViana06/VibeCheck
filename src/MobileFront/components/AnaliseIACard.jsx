import React from "react";
import { Text, Image, View, StyleSheet } from "react-native";
import roboIcone from "../assets/images/roboIA.png";
import getCorEmocaoPT from "../utils/getCorEmocaoPT";
import ProgressBar from "../components/ProgressBar";

export default function AnaliseIACard({ respostaIA }) {
  if (!respostaIA?.analiseIA) return null;

  const emocaoPredominante = respostaIA.analiseIA.emocaoPredominante;
  const frasesAnalisadas = respostaIA.analiseIA.frases ?? [];
  const corEmocaoPredominante = getCorEmocaoPT(emocaoPredominante).corEmocao;
  const emocaoEmPT = getCorEmocaoPT(emocaoPredominante).emocaoEmPT;
  const frasesEmocaoPred = frasesAnalisadas
    .filter((frase) => frase.emocao === emocaoPredominante)
    .sort((a, b) => b.intensidade - a.intensidade);

  return (
    <View style={styles.analiseCard}>
      <View style={styles.tituloCard}>
        <Image source={roboIcone} style={{ width: 12, height: 12 }} />
        <Text style={styles.tituloCardH1}>ANÁLISE DE IA</Text>
      </View>

      <View
        style={{
          marginTop: 18,
          backgroundColor: corEmocaoPredominante,
          paddingVertical: 4,
          paddingHorizontal: 8,
          alignSelf: "flex-start",
          borderRadius: 22,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>{emocaoEmPT}</Text>
      </View>

      {frasesEmocaoPred.map((frase) => (
        <View key={frase.trecho}>
          <Text style={styles.trechoEmocao}>"{frase.trecho}"</Text>
          <View style={styles.emocaoEIntensidade}>
            <Text style={styles.emocaoPredTrecho}>
              {getCorEmocaoPT(frase.emocao).emocaoEmPT}
            </Text>
            <Text style={styles.emocaoPredTrecho}> - </Text>
            <Text style={styles.intensidadeEmoTrecho}>{frase.intensidade}</Text>
          </View>
          <ProgressBar score={frase.intensidade} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  analiseCard: {
    backgroundColor: "#EEF4F8",
    flexDirection: "column",
    padding: 22,
    borderRadius: 16,
  },
  tituloCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tituloCardH1: {
    fontSize: 18,
    paddingTop: 6,
  },
  trechoEmocao: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: "#5a4a80",
    marginBottom: 4,
    marginTop: 18,
  },
  emocaoEIntensidade: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  emocaoPredTrecho: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 14,
    color: "#5a4a80",
    marginBottom: 4,
  },
  intensidadeEmoTrecho: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 14,
    color: "#5a4a80",
    marginBottom: 4,
  },
});
