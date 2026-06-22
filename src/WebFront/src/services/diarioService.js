import { api } from "./api";

export const diarioService = {
  
  async getTodasEntradas() {
    return await api.get("/gateway/psidiary");
  },

  
  async getEntradasByPaciente(pacienteId) {
    return await api.get(`/gateway/psidiary/filtro/paciente?pacienteId=${pacienteId}`);
  },

  
  async getEntradasByHumor(humor) {
    return await api.get(`/gateway/psidiary/filtro/humor?humor=${humor}`);
  },

  // Filtro por período
  async getEntradasByPeriodo(dataInicio, dataFim) {
    return await api.get(`/gateway/psidiary/filtro/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  },

  // Criar entrada (visão do paciente)
  async criarEntrada(dados) {
    return await api.post("/api/diary", dados);
  },

  // Histórico do paciente logado
  async getHistorico() {
    return await api.get("/api/diary/historico");
  },
};
export async function getHistorico() {
  return api.get('/api/diary/historico');
}

export async function getHistoricoPaciente(pacienteId) {
  return api.get(`/api/diary/historico/${pacienteId}`);
}

export async function criarEntrada(texto) {
  return api.post('/api/Diary', { texto });
}
  
