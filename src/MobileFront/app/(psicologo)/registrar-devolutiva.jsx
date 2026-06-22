import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import NavbarPsicologo from '../../components/NavbarPsicologo';
import { criarDevolutiva } from '../../services/devolutivaService';
import { useAuth } from '../../context/AuthContext';
import { linkService } from '../../services/linkService';
import api from '../../services/api';
import { Animated } from 'react-native';
import { useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';


export default function RegistrarDevolutivaScreen() {
  const params = useLocalSearchParams();

  const pacienteId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;
  const { usuario } = useAuth();
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const MAX = 2000;


  useEffect(() => {
    async function carregarPaciente() {
      try {
        const data = await linkService.getUsuarioInterno(pacienteId);
        setPaciente(data);
      } catch (err) {
        console.error('Erro ao carregar paciente:', err);
      }
    }
    carregarPaciente();
  }, [pacienteId]);
  useEffect(() => {
    setTexto('');
  }, [pacienteId]);

  async function handleEnviar() {
    if (loading) return;

    if (!texto.trim()) {
      Alert.alert(
        'Erro',
        'A devolutiva não pode ficar vazia.'
      );
      return;
    }

    if (texto.trim().length < 5) {
      Alert.alert(
        'Erro',
        'A devolutiva deve conter pelo menos 5 caracteres.'
      );
      return;
    }

    const payload = {
      patientId: pacienteId,
      texto,
      psicologoNome: usuario?.name,
    };

    setLoading(true);

    try {
      await criarDevolutiva(payload);

      setSucesso(true);

      progressAnim.setValue(1);

      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => setSucesso(false));

      setTexto('');
    } catch (err) {
      console.error('Erro completo:', err);

      Alert.alert(
        'Erro',
        err.message || 'Não foi possível enviar a devolutiva.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.page}>
      <NavbarPsicologo />
      <ScrollView contentContainerStyle={styles.container}>

        <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
          <Text style={styles.voltarText}>← voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Registrar devolutiva</Text>
        <Text style={styles.subtitulo}>Observação sobre o tratamento</Text>

        {/* Card do paciente */}
        <View style={styles.pacienteCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {paciente?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.pacienteNome}>{paciente?.name || 'Carregando...'}</Text>
            <Text style={styles.pacienteEntrada}>última entrada: hoje</Text>
          </View>
        </View>

        {/* Campo de texto */}
        <Text style={styles.label}>Observação clínica</Text>
        <Text style={styles.labelSub}>Será exibida ao paciente.</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Escreva sua devolutiva aqui..."
          placeholderTextColor="#B0A3CC"
          multiline
          maxLength={MAX}
          value={texto}
          onChangeText={setTexto}
        />


        {/* Botões */}
        <View style={styles.acoes}>
          <TouchableOpacity style={styles.btnCancelar} onPress={() => router.back()}>
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEnviar}
            disabled={loading}
            style={styles.btnEnviarWrapper}
          >
            <LinearGradient
              colors={['#C86F7A', '#D4876A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnEnviar}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnEnviarText}>Enviar</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {sucesso && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>✓ Enviada com sucesso!</Text>
            <View style={styles.toastBarBg}>
              <Animated.View style={[styles.toastBar, {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }]} />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ECE6F8',
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  voltarBtn: {
    marginBottom: 12,
  },
  voltarText: {
    color: '#9E8CC5',
    fontSize: 14,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  pacienteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c5cbf',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5b3ea6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  pacienteNome: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  pacienteEntrada: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  labelSub: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  textarea: {
    backgroundColor: '#DDD4F4',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#3b2a72',
    minHeight: 220,
    textAlignVertical: 'top',
  },
  contador: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 24,
  },
  acoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
  },
  btnCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DDD4F4',
    alignItems: 'center',
  },
  btnCancelarText: {
    color: '#7059B0',
    fontWeight: '600',
    fontSize: 15,
  },
  btnEnviarWrapper: {
    flex: 2,
  },
  btnEnviar: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnEnviarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  toast: {
    position: 'absolute',
    top: 10,
    right: 16,
    backgroundColor: '#EDE7F6',
    borderRadius: 12,
    padding: 14,
    minWidth: 50,
    zIndex: 999,
  },
  toastText: {
    color: '#6B4FA0',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  toastBarBg: {
    height: 4,
    backgroundColor: '#6B4FA0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  toastBar: {
    height: 4,
    backgroundColor: '#D1C4E9',
    borderRadius: 4,
  },
});

