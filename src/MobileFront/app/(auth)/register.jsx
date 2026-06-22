import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { registrarPaciente, registrarPsicologo, login as loginService } from '../../services/auth';
import logo from '../../assets/images/logo_vibecheck_transparente.png';

export default function Register() {
  const [role, setRole] = useState('paciente');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    crp: '',
    dataNascimento: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function formatarData(valor) {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  }

 function validarFormulario() {
  if (!form.name.trim()) {
    Alert.alert('Atenção', 'Nome é obrigatório.');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    Alert.alert('Atenção', 'E-mail inválido.');
    return false;
  }

  if (form.password.length < 6) {
    Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
    return false;
  }

  if (role === 'paciente') {
    const cpf = form.cpf.replace(/\D/g, '');
    if (cpf.length !== 11) {
      Alert.alert('Atenção', 'CPF inválido. Digite 11 dígitos.');
      return false;
    }
  }

  if (role === 'psicologo') {
    const crpRegex = /^\d{2}\/\d+$/;
    if (!crpRegex.test(form.crp)) {
      Alert.alert('Atenção', 'CRP inválido. Use o formato XX/XXXXXX.');
      return false;
    }
  }

  return true;
}

async function handleCadastro() {
  if (!validarFormulario()) return;
  setLoading(true);
  try {
    // Converte DD/MM/AAAA → YYYY-MM-DD para o backend
    const [dia, mes, ano] = form.dataNascimento.split('/');
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const payload = { ...form, dataNascimento: dataFormatada };

    if (role === 'paciente') {
      await registrarPaciente(payload);
    } else {
      await registrarPsicologo(payload);
    }

    const data = await loginService(form.email, form.password);
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
    const mensagemErro = err.response?.data?.message ?? err.message ?? 'Erro ao criar conta.';
    Alert.alert('Erro', mensagemErro);
  } finally {
    setLoading(false);
  }
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.titulo}>
        <Text style={styles.tituloVibe}>Vibe</Text>
        <Text style={styles.tituloCheck}>Check</Text>
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.tabTexto}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabAtivo]}>
          <Text style={[styles.tabTexto, styles.tabTextoAtivo]}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'paciente' && styles.roleBtnAtivo]}
          onPress={() => setRole('paciente')}
        >
          <Text style={[styles.roleTxt, role === 'paciente' && styles.roleTxtAtivo]}>
            Paciente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, role === 'psicologo' && styles.roleBtnAtivo]}
          onPress={() => setRole('psicologo')}
        >
          <Text style={[styles.roleTxt, role === 'psicologo' && styles.roleTxtAtivo]}>
            Psicólogo
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        placeholderTextColor="#aaa"
        value={form.name}
        onChangeText={(v) => atualizar('name', v)}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#aaa"
        value={form.email}
        onChangeText={(v) => atualizar('email', v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {role === 'paciente' ? (
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#aaa"
          value={form.cpf}
          onChangeText={(v) => atualizar('cpf', v.replace(/\D/g, ''))}
          keyboardType="numeric"
          maxLength={11}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="CRP"
          placeholderTextColor="#aaa"
          value={form.crp}
          onChangeText={(v) => atualizar('crp', v)}
          maxLength={7}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Data de nascimento (DD/MM/AAAA)"
        placeholderTextColor="#aaa"
        value={form.dataNascimento}
        onChangeText={(v) => atualizar('dataNascimento', formatarData(v))}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={form.password}
        onChangeText={(v) => atualizar('password', v)}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={handleCadastro}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Criar conta</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#5E499D',
  },
  roleBtn: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleBtnAtivo: {
    backgroundColor: '#5E499D',
  },
  roleTxt: {
    color: '#5E499D',
    fontWeight: 'bold',
  },
  roleTxtAtivo: {
    color: '#fff',
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