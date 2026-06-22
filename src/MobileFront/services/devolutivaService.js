import api from './api';

// PSICÓLOGO — criar devolutiva para um paciente
export async function criarDevolutiva({ patientId, texto, psicologoNome }) {
const resposta = await api.post('/feedback', {
    PacienteId: patientId,
    Texto: texto,
    PsicologoNome: psicologoNome,
});
return resposta.data;
}

// PSICÓLOGO — buscar devolutivas de um paciente específico
export async function getDevolutivasByPaciente(pacienteId) {
const resposta = await api.get(`/feedback/paciente/${pacienteId}`);
return resposta.data;
}

// PSICÓLOGO — deletar uma devolutiva
export async function deletarDevolutiva(id) {
const resposta = await api.delete(`/feedback/${id}`);
return resposta.data;
}

// PACIENTE — buscar suas próprias devolutivas
export async function getMeusDevolutivas() {
const resposta = await api.get('/feedback/meus');
return resposta.data;
}

// PACIENTE — ocultar uma devolutiva
export async function ocultarDevolutiva(id) {
const resposta = await api.delete(`/feedback/meus/${id}`);
return resposta.data;
}