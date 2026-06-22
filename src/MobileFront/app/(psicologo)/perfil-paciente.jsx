import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import NavbarPsicologo from '../../components/NavbarPsicologo';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { linkService } from '../../services/linkService';
import ProgressBar from '../../components/ProgressBar';
import { diarioService } from '../../services/diarioService';
import AnaliseIACard from '../../components/AnaliseIACard';
import EntradaDiarioCard from '../../components/EntradaDiarioCard';

export default function PerfilPacienteScreen() {
  const { id: idPaciente } = useLocalSearchParams();
  const [paciente, setPaciente] = useState(null);
  const [entradas, setEntradas] = useState([]);
  const iconeAnalisePeriodo = require("../../assets/images/growth.png");
  const pulso = useRef(new Animated.Value(0)).current;

  const corAnimada = pulso.interpolate({
    inputRange: [0, 1],
    outputRange: ['#5E499D', '#9b7fd4'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(pulso, { toValue: 0, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const buscarPaciente = async () => {
      try {
        const pacienteDb = await linkService.getUsuarioInterno(idPaciente);
        setPaciente(pacienteDb);
      } catch (error) {
        console.log("erro ao buscar o paciente no perfil do paciente: \n", error);
      }
    };

    const buscarDiario = async () =>
      diarioService.getEntradasByPaciente(idPaciente)
        .then((data) => {
          const entradas = (data ?? []).filter((e) => e.texto);
          setEntradas(entradas);
        })
        .catch((err) => console.error("Erro ao carregar diário:", err));

    buscarPaciente();
    buscarDiario();

  }, [idPaciente])

  let iniciaisNome = "??";
  if (paciente?.name) {
    const partes = paciente.name.split(" ");
    if (partes.length >= 2) {
      iniciaisNome = partes[0][0] + partes[1][0];
    } else if (partes[0]?.length >= 2) {
      iniciaisNome = partes[0][0] + partes[0][1];
    } else {
      iniciaisNome = "00";
    }
  }


  return (
    <View>
      <NavbarPsicologo />
      <View style={styles.bodyTela}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

          <View style={styles.nomeEIniciais}>
            <View style={styles.bubbleIniciais}><Text style={styles.textoIniciais}>{iniciaisNome}</Text></View>
            <Text style={styles.nomePaciente}>
              {paciente?.name}
            </Text>
          </View>
          <Pressable onPress={() => router.push(`/(psicologo)/analise-periodo?id=${idPaciente}`)} style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Animated.Text style={{ fontFamily: "Nunito-ExtraBold", color: corAnimada }}>Analise do período</Animated.Text>
            <Animated.Image source={iconeAnalisePeriodo} style={{ width: 20, height: 20, tintColor: corAnimada }} />
          </Pressable>
        </View>

        {/* <Button title='Registrar devolutiva' onPress={() => router.push({ pathname: '/(psicologo)/registrar-devolutiva', params: { id }, })} /> */}
        <Pressable onPress={() => router.push({ pathname: '/(psicologo)/registrar-devolutiva', params: { id: idPaciente }, })}>
          <LinearGradient colors={['#c86f7a', '#d4876a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.botaoDevolutiva}>
            <Text style={styles.textoBotaoDevolutiva}>+ Registrar devolutiva</Text>
          </LinearGradient>
        </Pressable>
        <ScrollView>

          {entradas.map((entrada, index) => (
            <EntradaDiarioCard key={entrada.id} entrada={entrada} defaultAberto={index === 0} />
          ))}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  botaoDevolutiva: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoDevolutiva: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16
  },
  bodyTela: {
    padding: 20
  },
  nomeEIniciais: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center"
  },
  bubbleIniciais: {
    backgroundColor: "#5E499D",
    color: "white",
    width: 48,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  textoIniciais: {
    color: "#fff",
    fontFamily: "Nunito-Bold",
    fontSize: 16
  },
  nomePaciente: {
    color: "#2e1f5e",
    fontFamily: "Nunito-ExtraBold",
    fontSize: 18
  }
})