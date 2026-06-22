import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";
import logo from "../../assets/logo_vibecheck_transparente.png";

export default function Login() {
  const [aba, setAba] = useState("entrar");

  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  
  const [role, setRole] = useState("paciente");
  const [nome, setNome] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [cpf, setCpf] = useState("");
  const [crp, setCrp] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const data = await authService.login(email, senha);
      login({ id: data.userId, name: data.name, email: data.email, role: data.role }, data.token);
      if (data.role === "psicologo") {
        navigate("/home-psicologo");
      } else {
        navigate("/home");
      }
    } catch (err) {
      const mensagemErro = err.response?.data?.message || err.response?.data || err.message || "E-mail ou senha inválidos.";
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  }

async function handleCadastro(e) {
  e.preventDefault();
  setErro("");
  setLoading(true);
  try {
    if (role === "paciente") {
      await authService.registerPaciente({
        name: nome,
        email: emailCadastro,
        password: senhaCadastro,
        cpf: cpf.replace(/\D/g, ''),
        dataNascimento,
      });
    } else {
      await authService.registerPsicologo({
        name: nome,
        email: emailCadastro,
        password: senhaCadastro,
        crp,
        dataNascimento,
      });
    }

    
    const data = await authService.login(emailCadastro, senhaCadastro);
    login({ name: data.name, email: emailCadastro, role: data.role }, data.token);

    if (data.role === "psicologo") {
      navigate("/home-psicologo");
    } else {
      navigate("/home");
    }

  } catch (err) {
    const mensagemErro = err.response?.data?.message || err.response?.data || err.message || "Erro ao criar conta. Tente novamente.";
    setErro(mensagemErro);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="login-page">
      <div className="login-card">

        
        <div className="login-logo">
          <img src={logo} alt="VibeCheck" />
          <h1>VibeCheck</h1>
        </div>

       
        <div className="login-abas">
          <button
            className={aba === "entrar" ? "aba-ativa" : ""}
            onClick={() => setAba("entrar")}
          >
            Entrar
          </button>
          <button
            className={aba === "cadastrar" ? "aba-ativa" : ""}
            onClick={() => setAba("cadastrar")}
          >
            Cadastrar
          </button>
        </div>

        
        {erro && <p className="login-erro">{erro}</p>}

        
        {aba === "entrar" && (
          <form onSubmit={handleLogin} className="login-form">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="sua senha"
              required
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <p className="login-esqueci"></p>
          </form>
        )}

        
        {aba === "cadastrar" && (
          <form onSubmit={handleCadastro} className="login-form">

            
            <div className="login-role">
              <button
                type="button"
                className={role === "paciente" ? "role-ativo" : ""}
                onClick={() => setRole("paciente")}
              >
                Paciente
              </button>
              <button
                type="button"
                className={role === "psicologo" ? "role-ativo" : ""}
                onClick={() => setRole("psicologo")}
              >
                Psicólogo
              </button>
            </div>

            <label>Nome completo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="seu nome"
              required
            />

            <label>E-mail</label>
            <input
              type="email"
              value={emailCadastro}
              onChange={(e) => setEmailCadastro(e.target.value)}
              placeholder="seu@email.com"
              required
            />

             {role === "paciente" && (
              <>
               <label>CPF</label>
              <input
                 type="text"
                 value={cpf}
                 onChange={(e) => setCpf(e.target.value)}
                 placeholder="00000000000 (apenas 11 números)"
                 required
               />
              
              </>
            )}

            {role === "psicologo" && (
              <>
                <label>CRP</label>
                <input
                  type="text"
                  value={crp}
                  onChange={(e) => setCrp(e.target.value)}
                  placeholder="00/00000 (apenas 7 números)"
                  required
                />
              </>
            )}

            <label>Data de nascimento</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />

            <label>Senha</label>
            <input
              type="password"
              value={senhaCadastro}
              onChange={(e) => setSenhaCadastro(e.target.value)}
              placeholder="sua senha"
              required
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}