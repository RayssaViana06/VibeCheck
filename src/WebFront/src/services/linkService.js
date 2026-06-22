import { api } from "./api";

export const linkService = {
  async getPacientesByPsicologo(psicologoId) {
    return await api.get(`/gateway/links/psicologo/${psicologoId}`);
  },
  async getVinculosByPaciente(pacienteId) {
    return await api.get(`/gateway/links/paciente/${pacienteId}`);
  },
  async solicitarVinculo(cpfPaciente) {
    return await api.post("/gateway/links/solicitar", { cpfPaciente });
  },
  async responderVinculo(vinculoId, acao) {
    return await api.put(`/gateway/links/${vinculoId}/responder?acao=${acao}`);
  },
  async getVinculoById(vinculoId) {
    return await api.get(`/gateway/links/${vinculoId}`);
  },
  async deletarVinculo(vinculoId) {
    return await api.delete(`/gateway/links/${vinculoId}`);
  },
  async getUsuarioInterno(userId) {
    return await api.internalGet(`/internal/auth/users/${userId}`);
  },
  async internalValidateLink(psychologistId, patientId) {
    return await api.internalGet(
      `/internal/auth/links/validate?psychologistId=${psychologistId}&patientId=${patientId}`
    );
  },
};