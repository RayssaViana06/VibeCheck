# Programação de Funcionalidades

A gestão e divisão de tarefas e papéis no desenvolvimento do trabalho está sendo realizada na plataforma GitHub Projects. Foi construído um quadro Kanban com as terefas planejadas (Todo), sendo realizadas (In Progress) e concluídas (Done) nesta etapa do projeto. Abaixo, temos uma imagem mostrando o panorama atual da gestão do projeto. A versão original pode ser acessada no GitHub Projects do repositório.


<img width="1144" height="892" alt="kanban" src="https://github.com/user-attachments/assets/42a5badf-850f-4696-beb7-f9c2f48e4fb7" />

# Padrões de Projeto de Codificação

## Visão Geral

O VibeCheck é desenvolvido seguindo uma arquitetura de microsserviços, com cada serviço tendo responsabilidades bem definidas e tecnologias padronizadas entre os membros da equipe. Os padrões descritos abaixo foram adotados para garantir consistência, legibilidade e facilidade de manutenção ao longo do desenvolvimento.

---

## Arquitetura Geral

O projeto é dividido nos seguintes serviços:

| Serviço | Responsabilidade |
|---|---|
| `auth-service` | Cadastro, login, logout, JWT, vínculos |
| `diary-service` | Entradas do diário, devolutivas, atividades |
| `ai-service` | Análise de emoções e padrões |
| `chat-service` | Chats e mensagens |
| `api-gateway` | Roteamento, repasse de token, ponto único de entrada |

Cada serviço possui seu próprio banco de dados e é implantado de forma independente no Render via Docker.

---

## Backend — ASP.NET Core com C#

### Estrutura de Pastas

Todos os microsserviços seguem a mesma estrutura de pastas:

```
service/
├── Controllers/    # endpoints da API
├── DTOs/           # objetos de transferência de dados
├── Middlewares/    # middlewares customizados
├── Models/         # modelos de dados
├── Services/       # regras de negócio
├── Settings/       # configurações (JWT, MongoDB, etc.)
├── appsettings.json
├── Program.cs
└── Dockerfile
```

### Padrão de Controllers

Todos os controllers seguem o padrão de injeção de dependência via construtor primário do C# 12 e retornam `IActionResult`:

```csharp
[ApiController]
public class AuthController(IUserServices userServices) : ControllerBase
{
    private readonly IUserServices _userServices = userServices;

    [HttpPost("gateway/auth/login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _userServices.LoginAsync(request);
        return Ok(result);
    }
}
```

### Padrão de Serviços

As regras de negócio são separadas dos controllers e organizadas em camadas de interface e implementação:

```csharp
public interface IUserServices
{
    Task<TokenModel> LoginAsync(LoginRequest request);
}

public class UserServices(IAuthBase authBase) : IUserServices
{
    public async Task<TokenModel> LoginAsync(LoginRequest request)
        => await authBase.LoginAsync(request);
}
```

### Padrão de Rotas

As rotas seguem o padrão prefixado pelo nome do serviço para evitar conflitos no API Gateway:

```
/gateway/auth/...   → Auth Service
/gateway/psidiary/... → Diary Service
/gateway/chat/...   → Chat Service
/internal/auth/...  → Endpoints internos do Auth Service
```

### Padrão de Respostas HTTP

| Situação | Status Code |
|---|---|
| Criação bem-sucedida | 201 Created |
| Operação bem-sucedida | 200 OK |
| Sem conteúdo para retornar | 204 No Content |
| Não autenticado | 401 Unauthorized |
| Não encontrado | 404 Not Found |

---

## API Gateway

O API Gateway foi desenvolvido seguindo a Clean Architecture, com separação em três projetos:

| Projeto | Responsabilidade |
|---|---|
| `Gateway.Domain` | Interfaces, models, requests e constantes |
| `Gateway.Application` | Serviços de aplicação, orquestração |
| `Gateway.Infra` | Implementação das chamadas HTTP aos microsserviços |
| `Gateway.Api` | Controllers e configuração da aplicação |

### Padrão de Chamadas HTTP

Todas as chamadas aos microsserviços passam por métodos genéricos centralizados:

```csharp
private async Task<TResponse> ExecutePost<TRequest, TResponse>(
    TRequest request, string httpClient, string endpoint)
{
    var client = httpClientFactory.CreateClient(httpClient);
    var message = new HttpRequestMessage(HttpMethod.Post, endpoint)
    {
        Content = new StringContent(
            JsonSerializer.Serialize(request),
            Encoding.UTF8,
            "application/json")
    };
    var response = await client.SendAsync(message);
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadFromJsonAsync<TResponse>();
}
```

---

## Frontend Web — React + Vite

### Estrutura de Pastas

```
src/
├── assets/       # imagens e ícones
├── components/   # componentes reutilizáveis
├── context/      # estado global (AuthContext)
├── hooks/        # hooks customizados (useAuth)
├── pages/        # uma pasta por página
├── routes/       # configuração de rotas
├── services/     # chamadas à API
└── styles/       # CSS global e variáveis
```


### Padrão de Serviços

Todas as chamadas à API passam pelo `api.js` centralizado, que adiciona automaticamente o token JWT no header de cada requisição:

```js
export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
  internalGet: (endpoint) =>
    request(endpoint, {
      method: "GET",
      headers: { "X-Internal-Key": INTERNAL_KEY },
    }),
};
```

### Padrão de Contexto e Autenticação

O estado global de autenticação é gerenciado pelo `AuthContext`, acessado em qualquer página via hook `useAuth`:

```jsx
const { user, token, role, login, logout } = useAuth();
```

### Padrão de Proteção de Rotas

Todas as rotas protegidas utilizam o componente `PrivateRoute`, que verifica autenticação e role antes de renderizar a página:

```jsx
function PrivateRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" />;
  return children;
}
```

### Padrão de Estilização

O projeto utiliza CSS Modules por página, com variáveis globais definidas em `variables.css`:

```css
:root {
  --color-primary: #6B4FA0;
  --color-accent: #E8805A;
  --color-background: #EDE9F6;
  --color-surface: #FFFFFF;
  --border-radius-lg: 20px;
  --shadow-md: 0 4px 16px rgba(107, 79, 160, 0.14);
}
```

---

## Banco de Dados

| Serviço | Banco | Tipo |
|---|---|---|
| `auth-service` | MongoDB Atlas | NoSQL |
| `diary-service` | MongoDB Atlas | NoSQL |
| `ai-service` | MongoDB Atlas | NoSQL |
| `chat-service` | MongoDB Atlas | NoSQL |
| `devolutivas-service` | MongoDB Atlas | NoSQL |
| `atividades-service` | MongoDB Atlas | NoSQL |

Cada serviço possui seu próprio banco isolado, sem acesso direto ao banco dos outros serviços. A comunicação entre serviços é feita exclusivamente via API.

---

## Controle de Versão

O projeto utiliza Git com GitHub. O fluxo de trabalho adotado pela equipe é:

1. Cada membro trabalha em sua própria branch
2. Antes de qualquer desenvolvimento, é feito `git pull` da `main` para manter a branch atualizada
3. Após alinhamento entre os membros, as atualizações são integradas à `main`
4. O repositório é hospedado no GitHub e o deploy é feito automaticamente pelo Render a cada push na branch respectiva de cada aluno responsável por seu serviço

---

## Deploy

Todos os serviços são implantados no **Render** via **Docker**, garantindo consistência entre os ambientes de desenvolvimento e produção. Cada microsserviço possui seu próprio `Dockerfile` e é deployado de forma independente.


# Artefatos

| RF | Descrição | Responsável | Artefatos (código fonte) | Rotas de API | Hospedagem |
|---|---|---|---|---|---|
| RF-001 | O sistema deve autenticar usuários do tipo paciente e psicólogo, permitindo login e logout de forma segura. | Guilherme Henrique Cardoso Souza | `src/auth-service/Controllers/AuthController.cs` | `POST /gateway/auth/login` `POST /gateway/auth/logout` | https://vibecheck-auth-service.onrender.com |
| RF-002 | O sistema deve permitir o cadastro de pacientes mediante informação de nome, e-mail e senha. | Guilherme Henrique Cardoso Souza | `src/aut-service//Controllers/AuthController.cs` | `POST /gateway/auth/register` | https://vibecheck-auth-service.onrender.com |
| RF-003 | O sistema deve permitir o cadastro de psicólogos mediante informação de dados profissionais básicos, como nome, e-mail, senha e número de registro no CRP. | Guilherme Henrique Cardoso Souza | `src/auth-service/Controllers/AuthController.cs` | `POST /gateway/auth/register` | https://vibecheck-auth-service.onrender.com |
| RF-004 | O sistema deve permitir a vinculação de um paciente a um psicólogo para fins de acompanhamento terapêutico. | Rafael Henrique dos Santos Silva | `src/auth-service/Controllers/AuthController.cs` | `POST /gateway/links/solicitar  PUT /gateway/links/{id}/responder` | https://vibecheck-auth-service.onrender.com |
| RF-005 | O sistema deve permitir que o paciente registre entradas no diário contendo texto livre. | Marcos Eduardo Fortunato, Vitor Bisi Vieira | `src/Back-End/VibeCheck/VibeCheck_v1.csproj` | `POST /gateway/diary` | https://vibecheckdiaryservice.onrender.com |
| RF-006 | O sistema deve exibir ao paciente o histórico de suas entradas no diário em ordem cronológica. | Marcos Eduardo Fortunato | `src/Back-End/VibeCheck/VibeCheck_v1.csproj`| `GET /gateway/diary/historico` | https://vibecheckdiaryservice.onrender.com |
| RF-007 | O sistema deve permitir que o psicólogo visualize as entradas do diário dos pacientes a ele vinculados. | Rayssa Eduarda Guilherme Viana | `src/Back-End/VibeCheck.activities/Controllers/DiarioController.cs` | `GET/api/Diario  GETapi/Diario/filtro/humor GET/api/Diario/filtro/paciente GET/api/Diario/filtro/periodo` | `https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-hlzy.onrender.com/` |`https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-hlzy.onrender.com/`|
| RF-008 | O sistema deve permitir a filtragem das entradas do diário por data específica ou intervalo de datas. | Isaque Albertini Silva Oliveira | `src/Back-End/apiDiarioFiltro/apiDiarioFiltro.Api/Controllers/DiaryController.cs` | `GET /api/diary/filter?dataEspecifica={data}GET /api/diary/filter?dataInicio={data}&dataFim={data}` | https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck.onrender.com |
| RF-010 | O sistema deve permitir que o psicólogo registre devolutivas comportamentais direcionadas ao paciente. | Isaque Albertini Silva Oliveira | `src/Back-End/apiVibeCheckFeedMs/apiVibeCheckFeedMs.Api/Controllers/FeedbackController.cs` | `POST /api/FeedbackGET /api/Feedback/paciente/{pacienteId}GET /api/Feedback/meusDELETE /api/Feedback/{id}DELETE /api/Feedback/meus/{id}` | https://pmv-ads-2026-1-e4-proj-infra-t4.onrender.com |
| RF-011 | O sistema deve permitir que o psicólogo registre atividades recomendadas ao paciente no contexto do tratamento em andamento. | Rayssa Eduarda Guilherme Viana |`src/Back-End/VibeCheck.activities/Controllers/ActivitiesController.cs` | `POST/api/Activities`|`https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-hlzy.onrender.com/`|
| RF-012 | O sistema deve disponibilizar um canal de comunicação via chat entre paciente e psicólogo vinculados. | Rafael Henrique dos Santos Silva | — | `POST gateway/message/criar-chat` `GET gateway/message/buscar-chats/{userId}` `DELETE gateway/message/deletar-chat/{chatId}` | — |
| RF-013 | O sistema deve analisar automaticamente cada frase das entradas do diário, identificando a emoção predominante e sua intensidade, utilizando um modelo de inteligência artificial. | Vitor Bisi Vieira | `src/AI_API/main.py` | `POST /analisar` | https://vibecheck-ai-service.onrender.com |
| RF-014 | O sistema deve determinar a emoção predominante de cada entrada do diário com base nas intensidades identificadas pelo modelo de inteligência artificial. | Vitor Bisi Vieira | `src/AI_API/main.py` | `POST /analisar` | https://vibecheck-ai-service.onrender.com |

#CRUDS

## Diário

### Create -> Nova Entrada

- **Tela:** `pages/NovaEntrada/NovaEntrada.jsx`
- **Rota:** `/nova-entrada`
- **Serviço:** `diarioService.criarEntrada()`
- **Método HTTP:** `POST`
- **Endpoint:** `/diary/entries`

**Trecho de código:**

```js
async criarEntrada(dados) {
    return await api.post("/api/diary", dados);
  },
```

```jsx
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
      
    } finally {
      navigate('/home');
    }
  }
```

**Evidência:**

-- <img width="647" height="561" alt="Nova entrada" src="https://github.com/user-attachments/assets/eb923dbf-3737-450d-a365-7b6085b88c80" />


---

### Read -> Diário na Home do paciente

- **Tela:** `pages/HomePaciente/HomePaciente.jsx`
- **Rota:** `/home`
- **Serviço:** `diarioService.listarEntradas()`
- **Método HTTP:** `GET`
- **Endpoint:** `/diary/entries?pacienteId=:id`

**Trecho de código:**
```js
export async function getHistoricoPaciente(pacienteId) {
  return api.get(`/api/diary/historico/${pacienteId}`);
}
```

```jsx
export default function HomePaciente() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState([]);
  const [expandidos, setExpandidos] = useState({});
  const [loading, setLoading] = useState(true);

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [respondendo, setRespondendo] = useState(false);
  const [nomePsicologo, setNomePsicologo] = useState('');

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await getHistorico();
        setEntradas(dados);
      } catch {
        setEntradas(MOCK);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [user]);
```

**Evidência:**

-- <img width="605" height="759" alt="Perfil Paciente" src="https://github.com/user-attachments/assets/84328fde-02ac-4d0d-ad6f-de08045f2a30" />


---

### Read — Feed no Perfil do Paciente na visão do psicólogo

- **Tela:** `pages/PerfilPaciente/PerfilPaciente.jsx`
- **Rota:** `/perfil-paciente/:id`
- **Serviço:** `diarioService.getEntradasByPaciente()`
- **Método HTTP:** `GET`
- **Endpoint:** `/diary/entries?pacienteId=:id`

**Evidência:**

<img width="1460" height="832" alt="Screenshot 2026-05-10 at 6 57 50 PM" src="https://github.com/user-attachments/assets/bb2df78c-e9d6-4e9a-952a-f3c79e194f25" />

---

## Devolutiva

### Create —> Registrar Devolutiva

- **Tela:** `pages/RegistrarDevolutiva/RegistrarDevolutiva.jsx`
- **Rota:** `/psicologo/paciente/:id/devolutiva`
- **Serviço:** `devolutivaService.criarDevolutiva()`
- **Método HTTP:** `POST`
- **Endpoint:** `/psychology/feedbacks`

**Trecho de código:**

```js
async criar({ patientId, texto, psicologoNome }) {
  return await api.post("/gateway/feedback", {
    PacienteId: patientId,
    Texto: texto,
    PsicologoNome: psicologoNome,
  });
},
```

```jsx
async function handleEnviar() {
  if (!texto.trim()) return;
  try {
    await devolutivaService.criar({
      patientId: pacienteId,
      texto: texto,
      psicologoNome: user.name,
    });
    navigate(`/perfil-paciente/${pacienteId}`);
  } catch (err) {
    console.error("Erro ao enviar devolutiva:", err);
  }
}
```

**Evidência:**

<img width="1411" height="877" alt="Captura de tela 2026-05-10 191812" src="https://github.com/user-attachments/assets/77aaee1e-7692-4f00-a8a4-a93ca505a226" />


---

### Read -> Lista de Devolutivas na visão do paciente

- **Tela:** `pages/Devolutivas/Devolutivas.jsx`
- **Rota:** `/devolutivas`
- **Serviço:** `devolutivaService.listarDevolutivas()`
- **Método HTTP:** `GET`
- **Endpoint:** `/psychology/feedbacks?pacienteId=:id`

**Trecho de código:**

```js
async getMeus() {
  return await api.get("/gateway/feedback/meus");
},
```

```jsx
useEffect(() => {
  async function carregar() {
    try {
      const data = await devolutivaService.getMeus();
      setDevolutivas(data);
    } catch (err) {
      console.error("Erro ao carregar devolutivas:", err);
    }
  }
  carregar();
}, []);
```

**Evidência:**

<img width="1054" height="642" alt="Captura de tela 2026-05-10 192000" src="https://github.com/user-attachments/assets/519165e2-7d87-4999-9b4f-75e445c0adb9" />


---

## Atividade

### Create —> Nova Atividade

- **Tela:** `pages/AtividadesPsicologo/AtividadesPsicologo.jsx`
- **Rota:** `/psicologo/atividades`
- **Serviço:** `atividadeService.criarAtividade()`
- **Método HTTP:** `POST`
- **Endpoint:** `/psychology/activities`

**Trecho de código:**

```js
async criar(dados) {
    return await api.post("/gateway/activities", dados);
  },
```

```jsx
export default function AtividadesPsicologo() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [atividades, setAtividades] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [erroAtividades, setErroAtividades] = useState("");
    const [form, setForm] = useState({ pacienteId: "", texto: "", dataEntrega: "" });

    useEffect(() => {
        if (user) carregarDados();
    }, [user]);

    async function carregarDados() {
        setLoading(true);
        setErro("");
        setErroAtividades("");

        const psicologoId = user?.id ?? user?.sub ?? user?.userId;

        if (!psicologoId) {
            setErro("Não foi possível identificar o psicólogo. Faça login novamente.");
            setLoading(false);
            return;
        }
```

**Evidência:**

<img width="400" height="1020" alt="Captura de tela 2026-05-10 192000" src="https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/blob/main/docs/img/CriaAtividade.png" />

---

### Read — Lista de Atividades (paciente)

- **Tela:** `pages/Atividades/Atividades.jsx`
- **Rota:** `/atividades`
- **Serviço:** `atividadeService.listarAtividades()`
- **Método HTTP:** `GET`
- **Endpoint:** `/psychology/activities?pacienteId=:id`

**Trecho de código:**

```js
async getAtividadesPaciente(pacienteId) {
    return await api.get(`/activities/paciente/${pacienteId}`);
  },
```

```jsx
  const [atividades, setAtividades] = useState([]);
  const [psicologaNome, setPsicologaNome] = useState(
    localStorage.getItem("psicologaNome") ?? "sua psicóloga"
  );
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (user) carregarDados();
  }, [user]);

  async function carregarDados() {
    setLoading(true);
    setErro("");
    try {
      const pacienteId = user?.id ?? user?.sub ?? user?.userId;

      
      const [atvsData, linksData] = await Promise.all([
            atividadeService.getAtividadesPaciente(pacienteId),
            linkService.getVinculosByPaciente(pacienteId).catch(() => []),
      ]);

      
      console.log("Atividades:", atvsData);
      console.log("Vínculos:", linksData);

      setAtividades(Array.isArray(atvsData) ? atvsData : []);

      
      const links = Array.isArray(linksData) ? linksData : [];
      const vinculoAtivo = links.find(
        (l) => l.status === "aceito" || l.status === "ativo" || l.status === 1
      ) ?? links[0]; 

      if (vinculoAtivo) {
        const psicId =
          vinculoAtivo.psicologoId ?? vinculoAtivo.psychologistId ?? vinculoAtivo.psicId;

        
        const nomeNoVinculo =
          vinculoAtivo.psicologoNome ??
          vinculoAtivo.nome ??
          vinculoAtivo.psychologistName;

        if (nomeNoVinculo) {
          setPsicologaNome(nomeNoVinculo);
          localStorage.setItem("psicologaNome", nomeNoVinculo);
        } else if (psicId) {
          
          try {
            const psicologo = await linkService.getUsuarioInterno(psicId);
            console.log("Psicólogo interno:", psicologo);
            const nome = psicologo?.name ?? psicologo?.nome ?? "sua psicóloga";
            setPsicologaNome(nome);
            localStorage.setItem("psicologaNome", nome);
          } catch {
         
          }
```

**Evidência:**

<img width="400" height="1020" alt="Captura de tela 2026-05-10 192000" src="https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/blob/main/docs/img/PasList.png" />

---

### Read —> Lista de Atividades - visão do psicólogo

- **Tela:** `pages/AtividadesPsicologo/AtividadesPsicologo.jsx`
- **Rota:** `/psicologo/atividades`
- **Serviço:** `atividadeService.listarAtividadesPsicologo()`
- **Método HTTP:** `GET`
- **Endpoint:** `/psychology/activities?psicologoId=:id`

```js
async getAtividades() {
    return await api.get("/gateway/activities");
  },
```

```jsx
 try {
            const atvsData = await atividadeService.getAtividades();
            setAtividades(Array.isArray(atvsData) ? atvsData : []);
        } catch (e) {
            console.error("[Atividades] Erro ao buscar atividades:", e.message);
            setErroAtividades("Não foi possível carregar as atividades.");
        }

        
        try {
            const linksData = await linkService.getPacientesByPsicologo(psicologoId);
            const links = Array.isArray(linksData) ? linksData : [];

            if (links.length === 0) {
                console.warn("[Atividades] Nenhum vínculo retornado. psicologoId:", psicologoId);
                setPacientes([]);
                setLoading(false);
                return;
            }

            
            console.log("[Atividades] Shape do link[0]:", JSON.stringify(links[0], null, 2));
            console.log("[Atividades] Total de vínculos:", links.length);

            const pacientesResolvidos = await Promise.all(
                links.map(async (link) => {
                    const pacId = extrairPacienteId(link);

                    if (!pacId) {
                        console.warn("[Atividades] Link sem ID identificável:", JSON.stringify(link));
                        return null;
                    }

                    const nomeDireto = extrairNomeDireto(link);
                    if (nomeDireto) {
                        return { id: pacId, nome: nomeDireto };
                    }
```

**Evidência:**

<img width="400" height="1020" alt="Captura de tela 2026-05-10 192000" src="https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/blob/main/docs/img/PsiList.png" />

---

### Update -> Marcar como Concluída

- **Tela:** `pages/Atividades/Atividades.jsx`
- **Rota:** `/atividades`
- **Serviço:** `atividadeService.concluirAtividade()`
- **Método HTTP:** `PATCH`
- **Endpoint:** `/psychology/activities/:id`

**Trecho de código:**
```js
async atualizar(id, dados) {
    return await api.put(`/activities/${id}`, dados);
  },
```

```jsx
 async function handleConcluir(atv) {
        if (atv.status === 1) return;
        const atualizada = { ...atv, status: 1, estaConcluida: true };
        setAtividades((prev) =>
            prev.map((a) => (a.id === atv.id ? atualizada : a))
        );
        try {
            await atividadeService.atualizarPaciente(atv.id, {
                pacienteId: atv.pacienteId,
                psicologoId: atv.psicologoId,
                texto: atv.texto,
                dataEntrega: atv.dataEntrega,
                status: 1,
                estaConcluida: true,
                createdAt: atv.createdAt,
                updatedAt: new Date().toISOString()
            });
        } catch {
            setAtividades((prev) =>
                prev.map((a) => (a.id === atv.id ? atv : a))
            );
        }
  }

```

**Evidência:**

<img width="400" height="1020" alt="Captura de tela 2026-05-10 192000" src="https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/blob/main/docs/img/PascConcluida.png" />

---

## Vínculo Psicólogo–Paciente

### Vincular Paciente

- **Tela:** `pages/HomePsicologo/HomePsicologo.jsx` (modal)
- **Rota:** `/psicologo/home`
- **Serviço:** `vinculoService.vincularPaciente()`
- **Método HTTP:** `POST`
- **Endpoint:** `/auth/links`

**Trecho de código:**

```js
async solicitarVinculo(cpfPaciente) {
  return await api.post("/gateway/links/solicitar", { cpfPaciente });
},
```

```jsx
async function handleVincular() {
  if (!cpfInput.trim()) return;
  setModalLoading(true);
  setModalErro("");
  try {
    const result = await linkService.solicitarVinculo(cpfInput.replace(/\D/g, ""));
    setPacienteVinculado(result);
    setModalEstado("sucesso");
  } catch (err) {
    setModalEstado("erro");
    setModalErro("Nenhum paciente encontrado com esse CPF. Verifique o número e tente novamente.");
  } finally {
    setModalLoading(false);
  }
}
```

**Evidência:**


<img width="759" height="591" alt="Tela requisicao de vinculo " src="https://github.com/user-attachments/assets/35e64f95-c2c8-401f-897e-f352164b1bb7" />

---

### Lista de Pacientes Vinculados

- **Tela:** `pages/HomePsicologo/HomePsicologo.jsx`
- **Rota:** `/psicologo/home`
- **Serviço:** `vinculoService.listarPacientes()`
- **Método HTTP:** `GET`
- **Endpoint:** `/auth/links?psicologoId=:id`

**Trecho de código:**
```js
async getPacientesByPsicologo(psicologoId) {
  return await api.get(`/gateway/links/psicologo/${psicologoId}`);
},
```

```jsx
const data = await linkService.getPacientesByPsicologo(user.id);
const ativos = data.filter((v) => v.status === "ativo");
```


**Evidência:**


<img width="736" height="473" alt="Tela lista de pacientes do psicologo" src="https://github.com/user-attachments/assets/747a25c1-748e-4dc0-9d0c-fcf71e974990" />

---

## Mensagem do Chat

### Create —> Enviar Mensagem

- **Tela:** `pages/Chat/Chat.jsx`
- **Rota:** `/chat`
- **Serviço:** `chatService.enviarMensagem()`
- **Método HTTP:** `POST`
- **Endpoint:** `/chat/messages`

**Trecho de código:**

```js

export const CHAT_HUB_URL = 'https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com/message/hub';

function buildChatHubUrl(token) {
	const url = new URL(CHAT_HUB_URL);

	if (token) {
		url.searchParams.set('token', token);
	}

	return url.toString();
}

export function getChatToken() {
	if (typeof window === 'undefined') {
		return '';
	}

	const params = new URLSearchParams(window.location.search);
	return params.get('token') || params.get('access_token') || localStorage.getItem('token') || '';
}

export function createChatConnection(token) {
	if (!token) {
		throw new Error('Token não informado para a conexão do chat.');
	}

	return new HubConnectionBuilder()
		.withUrl(buildChatHubUrl(token), {
			accessTokenFactory: () => token,
		})
		.withAutomaticReconnect()
		.configureLogging(LogLevel.Information)
		.build();
}

export async function startChatConnection(connection, onReceiveMessage) {
	if (onReceiveMessage) {
		connection.on('ReceiveMessage', onReceiveMessage);
	}

	await connection.start();
	return connection;
}

export async function sendChatMessage(connection, payload) {
	return connection.invoke('SendMessage', payload);
}

export async function stopChatConnection(connection) {
	if (!connection) {
		return;
	}

	connection.off('ReceiveMessage');
	await connection.stop();
}

export function getUserFromStorage() {
	if (typeof window === 'undefined') {
		return null;
	}

	const userJson = localStorage.getItem('user');
	if (!userJson) return null;

	try {
		return JSON.parse(userJson);
	} catch (e) {
		return null;
	}
}

```

```jsx
import React, {useState} from 'react';
import './ChatInput.css';

export default function ChatInput({onSend}){
  const [text, setText] = useState('');
  function submit(e){
    e && e.preventDefault();
    if(!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <form className="chatInput" onSubmit={submit}>
      <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Digite uma mensagem..." />
      <button type="submit">➤</button>
    </form>
  );
}

```

**Evidência:**

<img width="892" height="545" alt="image" src="https://github.com/user-attachments/assets/87487f77-5586-4845-8afe-bd3c76399477" />


---

### Read —> Listar Mensagens

- **Tela:** `pages/Chat/Chat.jsx`
- **Rota:** `/chat`
- **Serviço:** `chatService.listarMensagens()`
- **Método HTTP:** `GET`
- **Endpoint:** `/chat/messages?chatId=:id`

**Trecho de código:**
```js
const BASE_URL = 'https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-1800.onrender.com';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro na requisição');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const chatApi = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) =>
    request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

```

```jsx
import React from 'react';
import './MessageList.css';
import MessageBubble from './MessageBubble';

export default function MessageList({messages}){
  return (
    <div className="messageList">
      {messages.map(m => (
        <MessageBubble key={m.id} message={m} />
      ))}
    </div>
  );
}

```

**Evidência:**
<img width="901" height="345" alt="image" src="https://github.com/user-attachments/assets/bab8e877-53cf-40a0-96e7-1bc558ab82d2" />



# Autenticação com JWT, BCrypt e MongoDB no Auth Service

A autenticação do sistema foi implementada utilizando ASP.NET Core com JWT (JSON Web Tokens), BCrypt para criptografia de senhas e MongoDB como banco de dados. Essa combinação garante segurança, controle de acesso e separação de responsabilidades dentro da arquitetura de microsserviços do VibeCheck.

## Visão Geral

O Auth Service é o microsserviço responsável por toda a autenticação e autorização do sistema. Ele gerencia o cadastro e login de usuários, a geração e validação de tokens JWT, o logout com invalidação de tokens via blacklist e os vínculos entre psicólogos e pacientes. As requisições dos outros serviços e do frontend passam pelo API Gateway, que repassa o token JWT para validação.

## Configuração no Program.cs

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Key))
        };
    });
```

## Configurações JWT

As informações do JWT são definidas no `appsettings.json`:

```json
"Jwt": {
  "Key": "VibeCheck@2026#SecretKey!AuthService$JWT",
  "Issuer": "auth-service",
  "Audience": "vibecheck-app",
  "ExpiresInHours": 8
}
```

## Criptografia de Senhas

As senhas dos usuários nunca são armazenadas em texto puro. O BCrypt é utilizado para gerar um hash seguro no momento do cadastro e para validar a senha no momento do login:

```csharp
// Cadastro
user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

// Login
BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
```

## Blacklist de Tokens

O logout é implementado com uma blacklist armazenada no MongoDB. Quando o usuário faz logout, o token é adicionado à collection `blacklist`. O middleware `BlacklistMiddleware` intercepta todas as requisições e rejeita tokens que já foram invalidados, retornando erro 401.

## [Authorize]

O atributo `[Authorize]` é utilizado para restringir o acesso a endpoints que exigem autenticação. Quando aplicado, garante que apenas requisições com um token JWT válido no header `Authorization: Bearer {token}` sejam processadas. Qualquer tentativa sem autenticação resulta automaticamente em erro 401 (Unauthorized).

## Claims do Token JWT

O token gerado contém as seguintes informações do usuário:

| Claim | Valor |
|---|---|
| NameIdentifier | ID do usuário |
| Name | Nome do usuário |
| Email | Email do usuário |
| Role | "paciente" ou "psicologo" |

Essas claims são utilizadas pelo frontend e pelo API Gateway para identificar o usuário logado e controlar o acesso às rotas por perfil.

## Proteção de Rotas no Frontend

No frontend React, o `AuthContext` armazena o token e as informações do usuário após o login. O componente `PrivateRoute` verifica se o usuário está autenticado e se possui a role correta antes de renderizar cada página:

```jsx
function PrivateRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" />;
  return children;
}
```

Dessa forma, pacientes só acessam rotas de paciente e psicólogos só acessam rotas de psicólogo — qualquer tentativa de acesso indevido redireciona automaticamente para a tela de login.

## Endpoints Internos

Para comunicação entre microsserviços, o Auth Service expõe endpoints internos protegidos por API Key no header `X-Internal-Key`, sem necessidade de token JWT. Esses endpoints permitem que outros serviços validem vínculos e busquem dados de usuários sem expor informações sensíveis publicamente.

| Endpoint | Descrição |
|---|---|
| `GET /internal/auth/users/{id}` | Buscar dados de um usuário por ID |
| `GET /internal/auth/links/validate` | Validar vínculo entre psicólogo e paciente |
| `GET /internal/auth/links/psychologists/{id}/patients` | Listar pacientes de um psicólogo |

## Evidências de Implementação da Autenticação

### 1. Cadastro via API — Postman

A imagem evidencia o funcionamento do endpoint `POST /gateway/auth/register`. Foi realizado o cadastro de um psicólogo com nome, e-mail, senha, CRP e data de nascimento. A API retornou o status **201 Created**, confirmando que o usuário foi criado com sucesso no banco de dados MongoDB. A resposta inclui o ID gerado automaticamente, os dados cadastrados e os campos `createdAt` e `updatedAt` preenchidos automaticamente. A senha não é retornada na resposta, confirmando que apenas o hash BCrypt é armazenado.

<img width="785" height="715" alt="cadastro postman " src="https://github.com/user-attachments/assets/177ebe35-1240-44ad-8a1c-9b8d9f1a7053" />

### 2. Tela de Cadastro — Frontend

A imagem evidencia a tela de cadastro do VibeCheck. O usuário pode selecionar o perfil — Paciente ou Psicólogo — e preencher os campos de nome completo, e-mail, CPF, data de nascimento e senha. Quando o perfil selecionado é Psicólogo, o campo CRP é exibido automaticamente. Ao clicar em "Criar conta", o usuário é cadastrado e redirecionado automaticamente para sua home correspondente.
<img width="568" height="765" alt="front cadastro" src="https://github.com/user-attachments/assets/bceb0adc-8710-4bd6-b76a-72622e52ab16" />

### 3. Login via API — Postman

A imagem evidencia o funcionamento do endpoint `POST /gateway/auth/login`. Foi realizado o login com e-mail e senha de um paciente cadastrado. A API retornou o status **200 OK** com uma mensagem de sucesso, o token JWT gerado, o ID e a role do usuário. O token é utilizado nas requisições subsequentes para autenticar o usuário e controlar o acesso às rotas protegidas.


<img width="791" height="668" alt="Login Postman" src="https://github.com/user-attachments/assets/8e598e43-26ce-4206-ae2c-e78ab6599e44" />

### 4. Tela de Login — Frontend

A imagem evidencia a tela de login do VibeCheck implementada no frontend React. O formulário conta com campos de e-mail e senha, além da opção de alternar para a aba de cadastro. O design segue a identidade visual do projeto com a logo do VibeCheck, fundo em roxo claro e botão de entrada em laranja.

<img width="763" height="667" alt="front login" src="https://github.com/user-attachments/assets/50bb2ecb-e778-472f-82af-b19b85a6ef78" />


### 5. Rota Protegida com Token — Postman

A imagem evidencia o acesso bem-sucedido a uma rota protegida com token JWT válido. Foi realizada uma requisição `GET /gateway/auth/users` com o header `Authorization: Bearer {token}`. A API retornou o status **200 OK** com a lista de usuários cadastrados, incluindo ID, nome, e-mail, role, CPF, CRP, data de nascimento e datas de criação e atualização.

<img width="778" height="800" alt="postman rota protegida com token " src="https://github.com/user-attachments/assets/401dc09c-8030-4f55-b05d-aecaa6dd97e0" />

### 6. Rota Protegida sem Token — Postman

A imagem evidencia o comportamento do sistema ao tentar acessar uma rota protegida sem um token JWT válido. Foi realizada uma requisição `GET /gateway/auth/users` com o header `Authorization` vazio. A API retornou o status **401 Unauthorized**, confirmando que o middleware de autenticação está bloqueando corretamente o acesso não autorizado.

<img width="785" height="572" alt="rota protegida sem token " src="https://github.com/user-attachments/assets/65e84c3e-f307-479b-a96a-4fa773127e74" />

### 7. Home do Psicólogo após Login — Frontend

A imagem evidencia o redirecionamento automático após o login. Após autenticar com uma conta de psicólogo, o sistema identificou a role do usuário pelo token JWT e redirecionou para a Home do Psicólogo. A página exibe o nome da psicóloga logada, os cards de estatísticas com pacientes ativos, entradas hoje e não lidas, além da lista de pacientes vinculados com suas últimas entradas no diário.

<img width="1427" height="739" alt="front home apos login" src="https://github.com/user-attachments/assets/9fa320d9-773a-46a8-8f0d-8704fb4f91d1" />

## 8. Logout e Invalidação do Token — Postman

A imagem evidencia o funcionamento do endpoint `POST /gateway/auth/logout`. A requisição foi realizada com o token JWT no header `Authorization`. A API retornou o status **200 OK** com a mensagem "Logout realizado com sucesso!", confirmando que o token foi adicionado à blacklist no MongoDB. A partir desse momento, qualquer tentativa de usar o mesmo token resultará em erro 401.

<img width="795" height="580" alt="logout - desvalidando token" src="https://github.com/user-attachments/assets/491d5a51-8f16-4e20-9831-7459d7517959" />
