import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { getMeusDevolutivas, ocultarDevolutiva } from '../../services/devolutivaService';
import NavbarPaciente from '../../components/NavbarPaciente';

function formatarData(dataISO) {
  const data = new Date(dataISO);
  const hoje = new Date();

  if (data.toDateString() === hoje.toDateString()) {
    return `hoje, ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DevolutivaScreen() {
  const { usuario } = useAuth();
  const [devolutivas, setDevolutivas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await getMeusDevolutivas();
        setDevolutivas(data);
      } catch (err) {
        console.error('Erro ao carregar devolutivas:', err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  async function handleOcultar(id) {
    Alert.alert(
      'Excluir devolutiva',
      'Tem certeza que deseja excluir esta devolutiva?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await ocultarDevolutiva(id);
              setDevolutivas(prev => prev.filter(d => d.id !== id));
            } catch (err) {
              console.error('Erro ao ocultar:', err);
            }
          }
        }
      ]
    );
  }

  const maisRecente = devolutivas[0] || null;
  const anteriores = devolutivas.slice(1);

  return (
    <>
      <NavbarPaciente />
      <ScrollView style={styles.page} contentContainerStyle={styles.container}>

        <Text style={styles.titulo}>Devolutivas</Text>
        <Text style={styles.subtitulo}>Mensagens do seu psicólogo</Text>

        {carregando ? (
          <ActivityIndicator size="large" color="#6B4FA0" style={{ marginTop: 60 }} />
        ) : devolutivas.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma devolutiva recebida ainda.</Text>
        ) : (
          <>
            {maisRecente && (
              <>
                <Text style={styles.secaoLabel}>MAIS RECENTE</Text>
                <View style={styles.cardDestaque}>
                  <View style={styles.cardDestaqueHeader}>
                    <View>
                      <Text style={styles.psicologoNomeDestaque}>
                        {maisRecente.psicologoNome?.toUpperCase() || 'PSICÓLOGO'}
                      </Text>
                      <Text style={styles.dataDestaque}>
                        {formatarData(maisRecente.createdAt)}
                      </Text>
                    </View>
                    {maisRecente.nova && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>nova</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.textoDestaque}>{maisRecente.texto}</Text>
                </View>
              </>
            )}

            {anteriores.length > 0 && (
              <>
                <Text style={[styles.secaoLabel, styles.secaoLabelAnteriores]}>ANTERIORES</Text>
                {anteriores.map((dev) => (
                  <TouchableOpacity
                    key={dev.id}
                    style={styles.cardAnterior}
                    onLongPress={() => handleOcultar(dev.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.psicologoNome}>{dev.psicologoNome || 'Psicólogo'}</Text>
                    <Text style={styles.data}>{formatarData(dev.createdAt)}</Text>
                    <Text style={styles.texto}>{dev.texto}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}

        <View style={styles.hint}>
          <Text style={styles.hintText}>Pressione e segure para excluir uma devolutiva</Text>
        </View>
      </ScrollView>
    </>
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
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E1F5E',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#9E8CC5',
    marginBottom: 24,
  },
  vazio: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    marginTop: 60,
  },
  secaoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B4FA0',
    letterSpacing: 1,
    marginBottom: 10,
  },
  secaoLabelAnteriores: {
    marginTop: 24,
  },
  cardDestaque: {
    backgroundColor: '#6B4FA0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 8,
  },
  cardDestaqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  psicologoNomeDestaque: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dataDestaque: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  textoDestaque: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
  badge: {
    backgroundColor: '#c86f7a',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardAnterior: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  psicologoNome: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B4FA0',
    marginBottom: 2,
  },
  data: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 8,
  },
  texto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  hint: {
    marginTop: 24,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 11,
    color: '#aaa',
    fontStyle: 'italic',
  },
});