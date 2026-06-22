import { api } from "./api";

export const atividadeService = {
  
  async getAtividades() {
    return await api.get("/gateway/activities");
  },

  async getAtividadesPaciente(pacienteId) {
     return await api.get(`/gateway/activities/paciente/${pacienteId}`);
  },

  async atualizarPaciente(id, dados) {
     return await api.put(`/gateway/activities/paciente/${id}`, dados);
  },

  async getById(id) {
    return await api.get(`/gateway/activities/${id}`);
  },

  
  async criar(dados) {
    return await api.post("/gateway/activities", dados);
  },

 
  async atualizar(id, dados) {
    return await api.put(`/gateway/activities/${id}`, dados);
  },

 
  async deletar(id) {
    return await api.delete(`/gateway/activities/${id}`);
    },

   
};
