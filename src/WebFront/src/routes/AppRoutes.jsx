import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Login from "../pages/Login/Login";
import HomePaciente from "../pages/HomePaciente/HomePaciente";
import HomePsicologo from "../pages/HomePsicologo/HomePsicologo";
import NovaEntrada from "../pages/NovaEntrada/NovaEntrada";
import Devolutivas from "../pages/Devolutivas/Devolutivas";
import Atividades from "../pages/Atividades/Atividades";
import PerfilPaciente from "../pages/PerfilPaciente/PerfilPaciente";
import RegistrarDevolutiva from "../pages/RegistrarDevolutiva/RegistrarDevolutiva";
import AtividadesPsicologo from "../pages/AtividadesPsicologo/AtividadesPsicologo";
import Chat from "../pages/Chat/Chat";
import AnalisePeriodo from "../pages/AnalisePeriodo/AnalisePeriodo";


function PrivateRoute({ children }) {
  return children;
}

export default function AppRoutes() {
  const { role, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rotas do Paciente */}
      <Route path="/home" element={
        <PrivateRoute>
          <HomePaciente />
        </PrivateRoute>
      } />
      <Route path="/nova-entrada" element={
        <PrivateRoute>
          <NovaEntrada />
        </PrivateRoute>
      } />
      <Route path="/devolutivas" element={
        <PrivateRoute>
          <Devolutivas />
        </PrivateRoute>
      } />
<Route path="/atividades" element={
        <PrivateRoute>
          <Atividades />
        </PrivateRoute>
      } />

      {/* Rotas do Psicólogo */}
      <Route path="/home-psicologo" element={
        <PrivateRoute>
          <HomePsicologo />
        </PrivateRoute>
      } />
      <Route path="/perfil-paciente/:id" element={
        <PrivateRoute>
          <PerfilPaciente />
        </PrivateRoute>
      } />
      <Route path="/registrar-devolutiva/:id" element={
        <PrivateRoute>
          <RegistrarDevolutiva />
        </PrivateRoute>
      } />
      <Route path="/atividades-psicologo" element={
        <PrivateRoute>
          <AtividadesPsicologo />
        </PrivateRoute>
      } />
      <Route path="/analise-periodo/:id" element={
        <PrivateRoute>
          <AnalisePeriodo />
        </PrivateRoute>
      } />

      {/* Compartilhada */}
      <Route path="/chat" element={
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      } />

      {/* Redirect padrão */}
      <Route path="/" element={<Navigate to="/login" replace />} />
       <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
