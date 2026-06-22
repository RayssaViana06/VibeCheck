import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PacienteTabs() {
  return (
    <Tabs screenOptions={{
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
    }}>
      <Tabs.Screen name="diario" options={{
        title: 'Diário',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="atividades" options={{
        title: 'Atividades',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="checkbox-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="devolutiva" options={{
        title: 'Devolutivas',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="document-text-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="chat" options={{
        title: 'Chat',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubbles-outline" size={size} color={color} />
        )
      }} />
    </Tabs>
  );
}