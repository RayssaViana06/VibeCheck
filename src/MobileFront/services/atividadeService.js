import api from "./api";

export const atividadeService = {
  async getAtividades() {
    return await api.get("/activities");
  },

  async getAtividadesPaciente(pacienteId) {
    return await api.get(`/activities/paciente/${pacienteId}`);
  },

  async atualizarPaciente(id, dados) {
    return await api.put(`/activities/paciente/${id}`, dados);
  },

  async getById(id) {
    return await api.get(`/activities/${id}`);
  },

  async criar(dados) {
    return await api.post("/activities", dados);
  },

  async atualizar(id, dados) {
    return await api.put(`/activities/${id}`, dados);
  },

  async deletar(id) {
    return await api.delete(`/activities/${id}`);
  },
};
