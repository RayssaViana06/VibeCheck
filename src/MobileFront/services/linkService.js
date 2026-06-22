import api from './api';
import axios from 'axios';

const internalApi = axios.create({
  baseURL: 'https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-kg1h.onrender.com',
});

export function setInternalToken(token) {
  internalApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  internalApi.defaults.headers.common['X-Internal-Key'] = 'vibecheck-internal-key-2026';
}

export const linkService = {
  async getPacientesByPsicologo(psicologoId) {
    const resposta = await api.get(`/links/psicologo/${psicologoId}`);
    return resposta.data;
  },

  async solicitarVinculo(cpfPaciente) {
    const resposta = await api.post('/links/solicitar', { cpfPaciente });
    return resposta.data;
  },

  async responderVinculo(vinculoId, acao) {
    const resposta = await api.put(`/links/${vinculoId}/responder?acao=${acao}`);
    return resposta.data;
  },

  async getVinculosByPaciente(pacienteId) {
    const resposta = await api.get(`/links/paciente/${pacienteId}`);
    return resposta.data;
  },

  async getUsuarioInterno(userId) {
    const resposta = await internalApi.get(`/internal/auth/users/${userId}`);
    return resposta.data;
  },
};