import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavbarPsicologo.css";
import chat from "../../assets/chat.png";
import { IoLogOutOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";

export default function NavbarPsicologo() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function logOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <nav className="navbar">
      <div className="wrapperLogo">
        <h1 className="logoTitulo">VibeCheck</h1>
      </div>

      <div className="botoesNav">
        <Link className="pacientesBtn" to="/home-psicologo">
          <span>Pacientes</span>
        </Link>
        <Link className="atividadesBtn" to="/atividades-psicologo">
          <span>Atividades</span>
        </Link>
        <Link className="chatBtn" to="/chat" state={{ role: "psicologo" }}>
          <img src={chat} className="chatIcon" />
          <span>Chat</span>
        </Link>
        <div className="logoutButtonPsicologo" onClick={() => logOut()}>
          <div className="logout">Logout</div>
          <IoLogOutOutline color={"#fff"} size={24} />
        </div>
      </div>

      <button
        className="menuSanduiche"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir menu"
      >
        {menuAberto ? <IoCloseOutline size={30} /> : <IoMenuOutline size={30} />}
      </button>

      {menuAberto && (
        <div className="menuMobile">
          <Link to="/home-psicologo" onClick={fecharMenu}>
            <span>Pacientes</span>
          </Link>
          <Link to="/atividades-psicologo" onClick={fecharMenu}>
            <span>Atividades</span>
          </Link>
          <Link to="/chat" state={{ role: "psicologo" }} onClick={fecharMenu}>
            <img src={chat} className="menuMobileIcones" />
            <span>Chat</span>
          </Link>
          <a onClick={() => logOut()}>
            <IoLogOutOutline size={20} />
            <span>Logout</span>
          </a>
        </div>
      )}
    </nav>
  );
}