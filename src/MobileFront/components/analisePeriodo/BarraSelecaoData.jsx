import React from "react";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function BarraSelecaoData({ dadosEntradaDiario, dataInicio, setDataInicio, dataFim, setDataFim, aplicarIntervalo, setEntradasNoIntervalo }) {
  const [ehPeriodoFixo, setEhPeriodoFixo] = useState(false);
  const [botaoSelecionado, setBotaoSelecionado] = useState(0);
  const [mostrarPickerInicio, setMostrarPickerInicio] = useState(false);
  const [mostrarPickerFim, setMostrarPickerFim] = useState(false);

  const dataLimiteInferior = new Date(
    dadosEntradaDiario[dadosEntradaDiario.length - 1].createdAt,
  );
  const dataLimiteSuperior = new Date(dadosEntradaDiario[0].createdAt);

  function selecionarIntervalo(dias){

    const fim = new Date();
    const inicio = new Date();
    inicio.setDate(fim.getDate() - dias + 1);
    setDataFim(fim);
    setDataInicio(inicio)
    setEhPeriodoFixo(true);
    
    setBotaoSelecionado(dias);

  }

  function formatarData(date){

    if (!date) return "DD/MM/AAAA";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  }

  return (
    <View style={styles.barraSelecaoDatas}>
      <View style={styles.selecaoDatas}>
        <Text style={styles.labelPeriodo}>Período:</Text>

        <Pressable
          style={styles.inputData}
          onPress={() => setMostrarPickerInicio(true)}
        >
          <Text style={styles.textoData}>
            {ehPeriodoFixo ? "DD/MM/AAAA" : formatarData(dataInicio)}
          </Text>
        </Pressable>

        {mostrarPickerInicio && (
          <DateTimePicker
            value= {dataInicio || new Date()}
            mode = "date"
            display="default"
            minimumDate = {dataLimiteInferior}
            maximumDate = {dataLimiteSuperior > dataFim ? dataFim : dataLimiteSuperior}
            
            onChange = {(event, date) => {
              setMostrarPickerInicio(false);

              if (date){
                setBotaoSelecionado(0);
                setDataInicio(date);
                setEhPeriodoFixo(false);
                
                if(ehPeriodoFixo){
                  setDataFim(date);
                  setEhPeriodoFixo(false);
                }

              }
            }}
          />
        )}

        <Text style={styles.labelAte}>até</Text>

        <Pressable
          style={styles.inputData}
          onPress={() => setMostrarPickerFim(true)}
        >
          <Text style={styles.textoData}>
            {ehPeriodoFixo ? "DD/MM/AAAA" : formatarData(dataFim)}
          </Text>
        </Pressable>

        {mostrarPickerFim && (
          
          <DateTimePicker
            value={dataFim || new Date()}
            mode="date"
            display="default"
            minimumDate={dataLimiteInferior}
            maximumDate={dataLimiteSuperior}
            onChange={(event, date) => {
              setMostrarPickerFim(false);
              
              if(date){
                setDataFim(date);
                
                if(ehPeriodoFixo){
                  setDataInicio(date);
                  setEhPeriodoFixo(false);
                }
                setBotaoSelecionado(0);
              }

            }}
          />

        )}

        <Pressable
          style={[styles.botaoPeriodoFixo, botaoSelecionado === 7 && styles.btnAtivo]}
          onPress={() => selecionarIntervalo(7)}
        >
          <Text style={[styles.textoBotaoPeriodo, botaoSelecionado === 7 && styles.textoBtnAtivo]}>7d</Text>
        </Pressable>

        <Pressable
          style={[styles.botaoPeriodoFixo, botaoSelecionado === 14 && styles.btnAtivo]}
          onPress={() => selecionarIntervalo(14)}
        >
          <Text style={[styles.textoBotaoPeriodo, botaoSelecionado === 14 && styles.textoBtnAtivo]}>14d</Text>
        </Pressable>

        <Pressable
          style={[styles.botaoPeriodoFixo, botaoSelecionado === 30 && styles.btnAtivo]}
          onPress={() => selecionarIntervalo(30)}
        >
          <Text style={[styles.textoBotaoPeriodo, botaoSelecionado === 30 && styles.textoBtnAtivo]}>30d</Text>
        </Pressable>

      </View>

      <Pressable
        style={styles.botaoAplicarDatas}
        onPress={() => aplicarIntervalo(dataInicio, dataFim, dadosEntradaDiario, setEntradasNoIntervalo)}
      >
        <Text style={styles.textoBotaoAplicarDatas}>Aplicar</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  barraSelecaoDatas:{
    backgroundColor:'#fff',
    borderRadius:12,
    padding:12,
    marginBottom:16,
    elevation:2,
    shadowColor: '#000',
    shadowOffset:{ width: 0, height: 1 },
    shadowOpacity:0.06,
    shadowRadius:3,
  },
  selecaoDatas:{
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
    gap:8,
    marginBottom:10,

  },
  labelPeriodo:{
    fontFamily:'Nunito-SemiBold',
    fontSize:13,
    color:'#2e1f5e',
  },
  inputData:{
    borderWidth:1,
    borderColor:"#ddd4f4",
    borderRadius:8,
    paddingHorizontal:10,
    paddingVertical:6,
    backgroundColor:"#faf7ff",
  },
  textoData:{
    fontFamily:'Nunito-Regular',
    fontSize:13,
    color:'#5c4ba0',
  },
  labelAte:{
    fontFamily:'Nunito-Regular',
    fontSize:13,
    color:'#9e8cc5',
  },
  botaoPeriodoFixo:{
    borderWidth:1,
    borderColor:'#ddd4f4',
    borderRadius:8,
    paddingHorizontal:10,
    paddingVertical:6,
  },
  btnAtivo:{
    backgroundColor:'#5c4ba0',
    borderColor:'#5c4ba0',
  },
  textoBotaoPeriodo:{
    fontFamily:'Nunito-SemiBold',
    fontSize:13,
    color:'#5c4ba0',
  },

  textoBtnAtivo:{
    color:'#fff',
  },
  botaoAplicarDatas:{
    backgroundColor:'#5c4ba0',
    borderRadius:8,
    paddingVertical:10,
    alignItems:'center',
  },

  textoBotaoAplicarDatas:{
    fontFamily:'Nunito-Bold',
    fontSize:14,
    color:'#fff',
  },
});
