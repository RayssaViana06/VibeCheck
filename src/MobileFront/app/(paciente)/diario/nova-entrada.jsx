import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const MAX = 5000;

function formatarDataAtual() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function NovaEntradaScreen() {
  const { usuario, logout } = useAuth();
  const [texto, setTexto] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
  if (!texto.trim() || salvando) return;
  setSalvando(true);
  try {
    console.log('Enviando:', { texto });
    await api.post('https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-kg1h.onrender.com/api/diary', { texto });
  } finally {
    router.replace('/diario');
  }
}

  function handleLogout() {
    logout();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <View style={styles.navbarBrand}>
          <Text style={styles.navbarTitulo}>VibeCheck</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* VOLTAR */}
          <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
            <Text style={styles.voltarTexto}>← voltar</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Nova entrada</Text>
          <View style={styles.dataRow}>
            <Ionicons name="calendar-outline" size={14} color="#8a7bbf" />
            <Text style={styles.dataTexto}>{formatarDataAtual()}</Text>
          </View>

          {/* TEXTAREA */}
          <View style={styles.textareaWrapper}>
            <TextInput
              style={styles.textarea}
              placeholder="Como foi o seu dia? O que você está sentindo?"
              placeholderTextColor="#bbb"
              multiline
              value={texto}
              onChangeText={(t) => setTexto(t.slice(0, MAX))}
              textAlignVertical="top"
            />
          </View>

          <Text style={[styles.contador, texto.length >= MAX && styles.contadorLimite]}>
            {texto.length} / {MAX}
          </Text>

          {/* BOTÕES */}
          <View style={styles.botoesRow}>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => router.replace('/diario')}
            >
              <Text style={styles.btnCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSalvar, (!texto.trim() || salvando) && styles.btnSalvarDisabled]}
              onPress={handleSalvar}
              disabled={!texto.trim() || salvando}
            >
              <Text style={styles.btnSalvarTexto}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0eef8' },

  // navbar
  navbar: {
    backgroundColor: '#5c4faa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  navbarBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navbarTitulo: { color: '#fff', fontSize: 16, fontWeight: '700' },
  logoutBtn: { padding: 4 },

  // content
  content: { padding: 20, paddingBottom: 40 },
  voltarBtn: { marginBottom: 12 },
  voltarTexto: { fontSize: 14, color: '#8a7bbf' },
  titulo: { fontSize: 24, fontWeight: '700', color: '#2d2d2d', marginBottom: 6 },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  dataTexto: { fontSize: 13, color: '#8a7bbf' },

  // textarea
  textareaWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(92,79,170,0.15)',
    padding: 14,
    marginBottom: 8,
  },
  textarea: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    minHeight: 180,
  },

  // contador
  contador: { textAlign: 'right', fontSize: 12, color: '#b0a4d8', marginBottom: 20 },
  contadorLimite: { color: '#e07a5f' },

  // botões
  botoesRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  btnCancelar: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#c8bfef',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnCancelarTexto: { color: '#5c4faa', fontSize: 15, fontWeight: '700' },
  btnSalvar: {
    flex: 2,
    backgroundColor: '#e07a5f',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSalvarDisabled: { backgroundColor: '#e0b0a0' },
  btnSalvarTexto: { color: '#fff', fontSize: 15, fontWeight: '700' },
});