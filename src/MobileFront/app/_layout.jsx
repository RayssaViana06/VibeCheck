import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import {
  useFonts,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Nunito-Light': Nunito_300Light,
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(paciente)" />
        <Stack.Screen name="(psicologo)" />
      </Stack>
    </AuthProvider>
  );
}