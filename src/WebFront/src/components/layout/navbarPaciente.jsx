import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavbarPaciente.css";
import chat from "../../assets/chat.png";
import { IoLogOutOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";

export default function NavbarPaciente() {
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
        <a className="diarioBtn" onClick={() => navigate("/home")}>
          <span>Diário</span>
        </a>
        <a className="devolutivasBtn" onClick={() => navigate("/devolutivas")}>
          <span>Devolutivas</span>
        </a>
        <a className="atividadesBtn" onClick={() => navigate("/atividades")}>
          <span>Atividades</span>
        </a>
        <a className="chatBtn" onClick={() => navigate("/chat", { state: { role: "paciente" } })}>
          <img src={chat} className="chatIcon" />
          <span>Chat</span>
        </a>
        <div className="logoutButtonPaciente" onClick={() => logOut()}>
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
          <a onClick={() => { navigate("/home"); fecharMenu(); }}>
            <span>Diário</span>
          </a>
          <a onClick={() => { navigate("/devolutivas"); fecharMenu(); }}>
            <span>Devolutivas</span>
          </a>
          <a onClick={() => { navigate("/atividades"); fecharMenu(); }}>
            <span>Atividades</span>
          </a>
          <a onClick={() => { navigate("/chat", { state: { role: "paciente" } }); fecharMenu(); }}>
            <img src={chat} className="menuMobileIcones" />
            <span>Chat</span>
          </a>
          <a onClick={() => logOut()}>
            <IoLogOutOutline size={20} />
            <span>Logout</span>
          </a>
        </div>
      )}
    </nav>
  );
}