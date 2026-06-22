import React, { useState, useEffect } from "react";
import "./PerfilPaciente.css";
import NavbarPsicologo from "../../components/layout/NavbarPsicologo";
import EntradaDiarioCard from "../../components/common/EntradaDiarioCard/EntradaDiarioCard";
import InfoPacienteFoto from "../../components/common/infoPacenteFoto";
import iconeGraficosAnalise from "../../assets/growth.png";
import { useNavigate, useParams } from "react-router-dom";
import { diarioService } from "../../services/diarioService";

export default function PerfilPaciente() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    diarioService.getEntradasByPaciente(id)
      .then((data) => setEntradas((data ?? []).filter((e) => e.texto)))
      .catch((err) => console.error("Erro ao carregar diário:", err));
    
    console.log(entradas);
  }, [id]);

  return (
    <div className="background">
      <NavbarPsicologo />
      <InfoPacienteFoto mostrarBotaoDevolutiva={true} numEntradas={entradas.length} />
      <main>
        <div className="tituloTimeline">
          <h2 className="tituloBody">ENTRADAS DO DIÁRIO</h2>
          <div className="evolucaoEmocional" onClick={() => navigate(`/analise-periodo/${id}`, { state: { entradas } })}>
            <h3 className="tituloEvolucao">Evolução emocional</h3>
            <img src={iconeGraficosAnalise} className="iconeGraficosAnalise" />
          </div>
        </div>
        <div className="timelineWrapper">
          <div className="entradasTimeline">
            {entradas.map((entrada, index) => (
              <EntradaDiarioCard key={entrada.id} entrada={entrada} mostrarAnaliseIA={true} defaultAberto={index === 0}/>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
