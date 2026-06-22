import { api } from "./api";

export const devolutivaService = {
  
async criar({ patientId, texto, psicologoNome }) {
    return await api.post("/gateway/feedback", {
      PacienteId: patientId,
      Texto: texto,
      PsicologoNome: psicologoNome,
    });
  },
  
  
async getByPaciente(pacienteId) {
    return await api.get(`/gateway/feedback/paciente/${pacienteId}`);
},

  
async deletar(id) {
    return await api.delete(`/gateway/feedback/${id}`);
},

  
async getMeus() {
    return await api.get("/gateway/feedback/meus");
},

async ocultar(id) {
    return await api.delete(`/gateway/feedback/meus/${id}`);
},
};
