import api from './api';

export async function login(email, senha) {
  const resposta = await api.post('/auth/login', { email, password: senha });
  return resposta.data;
}

export async function registrarPaciente(dados) {
  const resposta = await api.post('/auth/register', {
    name: dados.name,
    email: dados.email,
    password: dados.password,
    role: 'paciente',
    cpf: dados.cpf,
    dataNascimento: dados.dataNascimento,
  });
  return resposta.data;
}

export async function registrarPsicologo(dados) {
  const resposta = await api.post('/auth/register', {
    name: dados.name,
    email: dados.email,
    password: dados.password,
    role: 'psicologo',
    crp: dados.crp,
    dataNascimento: dados.dataNascimento,
  });
  return resposta.data;
}

export async function logout() {
  const resposta = await api.post('/auth/logout', {});
  return resposta.data;
}