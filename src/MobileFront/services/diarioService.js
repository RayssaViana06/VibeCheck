import api from './api';

export const diarioService = {
  async getEntradasByPaciente(pacienteId) {
    const resposta = await api.get(`/psidiary/filtro/paciente?pacienteId=${pacienteId}`);
    return resposta.data;
  },

  async criarEntrada(dados) {
    const resposta = await api.post('/diary', dados);
    return resposta.data;
  },

  async getHistorico() {
    const resposta = await api.get('/diary/historico');
    return resposta.data;
  },
};