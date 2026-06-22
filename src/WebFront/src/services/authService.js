import { api } from "./api";

export const authService = {
  async login(email, password) {
    return await api.post("/gateway/auth/login", { email, password });
  },

  async registerPaciente(data) {
    return await api.post("/gateway/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "paciente",
      cpf: data.cpf,
      dataNascimento: data.dataNascimento,
    });
  },

  async registerPsicologo(data) {
    return await api.post("/gateway/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "psicologo",
      crp: data.crp,
      dataNascimento: data.dataNascimento,
    });
  },

  async logout() {
    return await api.post("/gateway/auth/logout", {});
  },
};