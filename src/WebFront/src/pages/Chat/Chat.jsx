import React from 'react';
import NavbarPsicologo from '../../components/layout/NavbarPsicologo';
import ChatLayout from './Components/ChatLayout';
import { useLocation } from 'react-router-dom';
import NavbarPaciente from '../../components/layout/navbarPaciente';

export default function Chat(){

  const {state} = useLocation();
  const role = state?.role;

  return (
    <div className="chatPage">
      {
        (role === "psicologo") ? <NavbarPsicologo /> : <NavbarPaciente/>
      }        
      <ChatLayout />
    </div>
  );
}
