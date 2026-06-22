import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { login as loginService } from '../../services/auth';
import logo from '../../assets/images/logo_vibecheck_transparente.png';
export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

 async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginService(email, senha);
      await login(
        { name: data.name, userId: data.userId, role: data.role },
        data.token
      );
      if (data.role === 'psicologo') {
        router.replace('/(psicologo)/pacientes');
      } else {
        router.replace('/(paciente)/diario');
      }
    } catch (err) {
      const mensagemErro = err.response?.data?.message || err.response?.data || err.message || 'E-mail ou senha inválidos.';
      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
}

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      {/* TÍTULO */}
      <Text style={styles.titulo}>
        <Text style={styles.tituloVibe}>Vibe</Text>
        <Text style={styles.tituloCheck}>Check</Text>
      </Text>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabAtivo]}>
          <Text style={[styles.tabTexto, styles.tabTextoAtivo]}>Entrar</Text>
          <View style={styles.tabUnderline} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.tabTexto}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      {/* INPUTS */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      {/* BOTÃO */}
      <TouchableOpacity
        style={styles.botao}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Entrar</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f0ff',
  },
  logo: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 24,
  },
  tituloVibe: {
    fontWeight: 'bold',
    color: '#5E499D',
  },
  tituloCheck: {
    fontWeight: 'bold',
    color: '#3a2a6e',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 8,
  },
  tabAtivo: {
    borderBottomWidth: 2,
    borderBottomColor: '#5E499D',
  },
  tabTexto: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: '600',
  },
  tabTextoAtivo: {
    color: '#5E499D',
  },
  tabUnderline: {
    display: 'none', 
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0d6f0',
  },
  botao: {
    backgroundColor: '#d1816e',
    borderRadius: 50,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});