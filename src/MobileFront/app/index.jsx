import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6b3fa0" />
      </View>
    );
  }

  if (!usuario) {
    return <Redirect href="/(auth)/login" />;
  }

  if (usuario.role === 'psicologo') {
    return <Redirect href="/(psicologo)/pacientes" />;
  }

  return <Redirect href="/(paciente)/diario" />;
}