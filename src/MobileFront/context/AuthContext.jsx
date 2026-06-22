import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setToken, removerToken } from '../services/api';
import { setInternalToken } from '../services/linkService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const token = await SecureStore.getItemAsync('token');
        const usuarioStr = await SecureStore.getItemAsync('usuario');
        if (token && usuarioStr) {
          setToken(token);
          setInternalToken(token);
          setUsuario(JSON.parse(usuarioStr));
        }
      } catch (err) {
        console.log('Erro ao carregar sessão:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarSessao();
  }, []);

  async function login(dados, token) {
    setToken(token);
    setInternalToken(token);
    setUsuario(dados);
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('usuario', JSON.stringify(dados));
    await SecureStore.setItemAsync('role', dados.role);
  }

  async function logout() {
    removerToken();
    setUsuario(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('usuario');
    await SecureStore.deleteItemAsync('role');
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}