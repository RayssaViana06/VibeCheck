import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PsicologoTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6b3fa0',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0d6f0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="pacientes"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="atividades"
        options={{
          title: 'Atividades',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="perfil-paciente" options={{ href: null, title: 'Perfil do Paciente' }} />
      <Tabs.Screen name="analise-periodo" options={{ href: null, title: 'Análise do Período' }} />
      <Tabs.Screen name="registrar-devolutiva" options={{ href: null, title: 'Devolutiva' }} />
    </Tabs>
  );
}