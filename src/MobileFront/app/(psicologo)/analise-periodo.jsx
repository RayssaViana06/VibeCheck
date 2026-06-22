import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import NavbarPsicologo from '../../components/NavbarPsicologo';
import React, { useEffect, useState } from 'react';
import { diarioService } from '../../services/diarioService';
import { aplicarIntervalo, limparUmDiarioHeatmap } from '../../utils/FuncoesAnalisePeriodo';
import BarraSelecaoData from '../../components/analisePeriodo/BarraSelecaoData';
import GraficoBarrasFrequencia from '../../components/analisePeriodo/GraficoBarrasFrequencia';
import RadarEmocional from '../../components/analisePeriodo/RadarEmocional';

export default function AnalisePeriodoScreen() {
  const { id: idPaciente } = useLocalSearchParams();
  const [dadosEntradaDiario,setDadosEntradaDiario] = useState([]);
  const [entradasNoIntervalo,setEntradasNoIntervalo] = useState([]);
  const [dataInicio,setDataInicio] = useState(new Date());
  const [dataFim,setDataFim] = useState(new Date());
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    diarioService.getEntradasByPaciente(idPaciente)
      .then((data) => {
        const entradas = (data ?? []).filter((entrada) => entrada.texto);
        if(entradas.length === 0) {
          setCarregando(false);
          return;
        }
        setDadosEntradaDiario(entradas);

        const fim = new Date(entradas[0].createdAt);
        const inicio =new Date(entradas[entradas.length -1].createdAt);
        setDataFim(fim);
        setDataInicio(inicio);

        aplicarIntervalo(inicio, fim, entradas, setEntradasNoIntervalo);
      })
      .catch((err) => console.log("erro ao carregar diário na analise dos graficos:", err))
      .finally(() => setCarregando(false));
  }, [idPaciente]);

  if (carregando) {
    return (
      <View style={styles.containerSpinner}>
        <ActivityIndicator size="large" color="#5c4ba0" />
      </View>
    );
  }

  if (dadosEntradaDiario.length === 0) {
    return (
      <>
        <NavbarPsicologo />
        <View style={styles.containerSpinner}>
          <Text style={styles.textoVazio}>Não foi encontrada nenhuma entrada no diário</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <NavbarPsicologo />
      <ScrollView style={styles.containerGrafico} contentContainerStyle={styles.estiloConteudoContainer}>
        <Text style={styles.titulo}>Análise do período</Text>
        <BarraSelecaoData
          dadosEntradaDiario= {dadosEntradaDiario}
          dataInicio = {dataInicio}
          setDataInicio = {setDataInicio}
          dataFim = {dataFim}
          setDataFim = {setDataFim}
          aplicarIntervalo = {aplicarIntervalo}
          setEntradasNoIntervalo = {setEntradasNoIntervalo}
        />
        <GraficoBarrasFrequencia entradasNoIntervalo = {entradasNoIntervalo} />
        <RadarEmocional entradasNoIntervalo = {entradasNoIntervalo} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  containerGrafico: {
    flex: 1,
    backgroundColor: '#f5f0ff',
  },
  estiloConteudoContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#2e1f5e',
    marginBottom: 16,
  },
  containerSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoVazio: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#9e8cc5',
  },
});
