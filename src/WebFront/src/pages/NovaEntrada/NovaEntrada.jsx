import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { criarEntrada } from '../../services/diarioService';
import NavbarPaciente from '../../components/layout/NavbarPaciente';
import './NovaEntrada.css';

const MAX = 5000;

function formatarDataAtual() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NovaEntrada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!texto.trim() || salvando) return;
    setSalvando(true);
    try {
      await criarEntrada(texto);
    } catch {
      // entrada salva mesmo com erro na IA — segue pra home
    } finally {
      navigate('/home');
    }
  }

  return (
    <div>
      <NavbarPaciente />

      <div className="nova-entrada-page">
        <button className="voltar-link" onClick={() => navigate('/home')}>
          ← voltar
        </button>

        <h1>Nova entrada</h1>
        <div className="nova-entrada-data">
          <span>&#128197;</span>
          <span>{formatarDataAtual()}</span>
        </div>

        <div className="textarea-wrapper">
          <textarea
            className="entrada-textarea"
            placeholder="Como foi o seu dia? O que você está sentindo?"
            value={texto}
            maxLength={MAX}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>

        <div className={`contador ${texto.length >= MAX ? 'limite' : ''}`}>
          {texto.length} / {MAX}
        </div>

        <div className="botoes-row">
          <button className="btn-cancelar" onClick={() => navigate('/home')}>
            Cancelar
          </button>
          <button
            className="btn-salvar"
            onClick={handleSalvar}
            disabled={!texto.trim() || salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar entrada'}
          </button>
        </div>
      </div>
    </div>
  );
}