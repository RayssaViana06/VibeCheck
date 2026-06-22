# Arquitetura da Solução

## Visão Geral

O sistema foi projetado utilizando uma **arquitetura de microserviços**, onde cada serviço é responsável por um domínio específico da aplicação. Isso permite maior escalabilidade, manutenção mais simples e evolução independente dos componentes.

Os clientes acessam o sistema através de aplicações **Web** e **Mobile**, que se comunicam com uma **API Gateway**. O Gateway atua como uma camada intermediária responsável por organizar as chamadas para os microserviços.

Cada microserviço possui **seu próprio banco de dados**, seguindo o princípio de **isolamento de dados** em arquiteturas de microserviços.

---

## Processos e suas atividades

Os processos são divididos e organizados abaixo de acordo com os atores das atividades.

### 1. Paciente

| Processo | Atividade |
|---|---|
| Autenticação | Abrir o aplicativo |
| | Realizar cadastro informando nome, e-mail, senha, CPF e data de nascimento |
| | Realizar login com e-mail e senha |
| | Realizar logout |
| Diário Emocional | Registrar entrada diária de sentimentos e emoções |
| | Visualizar histórico de entradas do diário |
| | Receber devolutivas do psicólogo |
| | Receber e realizar atividades propostas pelo psicólogo |
| Vínculo | Receber solicitação de vínculo de um psicólogo |
| | Aceitar ou recusar solicitação de vínculo |
| | Visualizar psicólogo vinculado |
| Chat | Enviar e receber mensagens do psicólogo vinculado |

### 2. Psicólogo

| Processo | Atividade |
|---|---|
| Autenticação | Abrir o aplicativo |
| | Realizar cadastro informando nome, e-mail, senha, CRP, CPF e data de nascimento |
| | Realizar login com e-mail e senha |
| | Realizar logout |
| Vínculo | Solicitar vínculo com paciente pelo CPF |
| | Visualizar lista de pacientes vinculados |
| | Encerrar vínculo com paciente |
| Acompanhamento | Visualizar entradas do diário dos pacientes vinculados |
| | Visualizar análises e padrões emocionais gerados pela IA |
| | Receber alertas de sinais de risco identificados pela IA |
| | Enviar devolutivas ao paciente |
| | Propor atividades ao paciente |
| Chat | Enviar e receber mensagens do paciente vinculado |

### 3. Auth Service

| Processo | Atividade |
|---|---|
| Gerenciamento de Usuários | Receber e processar solicitação de cadastro de paciente ou psicólogo |
| | Validar unicidade de e-mail |
| | Criptografar senha com BCrypt |
| | Armazenar usuário no banco de dados |
| | Receber e processar solicitação de login |
| | Validar credenciais do usuário |
| | Gerar token JWT com claims de ID, nome, e-mail e role |
| | Receber solicitação de logout |
| | Invalidar token JWT via blacklist |
| Gerenciamento de Vínculos | Receber solicitação de vínculo do psicólogo |
| | Localizar paciente pelo CPF |
| | Registrar solicitação de vínculo com status pendente |
| | Receber resposta do paciente (aceitar ou recusar) |
| | Atualizar status do vínculo |
| | Expor endpoints internos para validação de vínculo entre psicólogo e paciente |

### 4. Diary Service

| Processo | Atividade |
|---|---|
| Entradas do Diário | Receber e armazenar entrada emocional do paciente |
| | Disponibilizar histórico de entradas para o paciente |
| | Disponibilizar entradas para o psicólogo vinculado |
| Devolutivas e Atividades | Receber e armazenar devolutiva do psicólogo |
| | Receber e armazenar atividade proposta pelo psicólogo |
| | Notificar paciente sobre nova devolutiva ou atividade |
| | Registrar conclusão de atividade pelo paciente |

### 5. AI Service

| Processo | Atividade |
|---|---|
| Análise Emocional | Receber entradas do diário do paciente |
| | Identificar padrões emocionais ao longo do tempo |
| | Classificar emoções registradas |
| | Detectar sinais de alerta e risco emocional |
| | Gerar relatório de evolução emocional do paciente |
| | Disponibilizar análises para o psicólogo |

### 6. Chat Service

| Processo | Atividade |
|---|---|
| Mensagens | Receber e armazenar mensagens entre paciente e psicólogo |
| | Validar vínculo ativo entre os participantes antes de permitir o chat |
| | Disponibilizar histórico de mensagens |
| | Notificar usuário sobre nova mensagem recebida |

## Diagrama BPMN

Os processos de negócio foram modelados no diagrama BPMN abaixo.

<img width="3300" height="1800" alt="Image" src="https://github.com/user-attachments/assets/0ad3b8c5-2c7e-4365-9ba6-7c2d0c2d40ca" />

---
## Requisitos Funcionais

| ID | Descrição | Tipo | Categoria | Origem (Processo) | Prioridade |
|---|---|---|---|---|---|
| RF-001 | O sistema deve autenticar usuários do tipo paciente e psicólogo, permitindo login e logout de forma segura. | Funcional | Autenticação | Paciente – Autenticação / Psicólogo – Autenticação | Alta |
| RF-002 | O sistema deve permitir o cadastro de pacientes mediante informação de nome, e-mail e senha. | Funcional | Cadastro | Paciente – Autenticação | Alta |
| RF-003 | O sistema deve permitir o cadastro de psicólogos mediante informação de dados profissionais básicos, como nome, e-mail, senha e número de registro no CRP. | Funcional | Cadastro | Psicólogo – Autenticação | Alta |
| RF-004 | O sistema deve permitir a vinculação de um paciente a um psicólogo para fins de acompanhamento terapêutico. | Funcional | Vínculo | Paciente – Vínculo / Psicólogo – Vínculo | Alta |
| RF-005 | O sistema deve permitir que o paciente registre entradas no diário contendo texto livre. | Funcional | Diário Emocional | Paciente – Diário Emocional | Alta |
| RF-006 | O sistema deve exibir ao paciente o histórico de suas entradas no diário em ordem cronológica. | Funcional | Diário Emocional | Paciente – Diário Emocional | Alta |
| RF-007 | O sistema deve permitir que o psicólogo visualize as entradas do diário dos pacientes a ele vinculados. | Funcional | Acompanhamento | Psicólogo – Acompanhamento | Alta |
| RF-008 | O sistema deve permitir a filtragem das entradas do diário por data específica ou intervalo de datas. | Funcional | Diário Emocional | Paciente – Diário Emocional | Média |
| RF-010 | O sistema deve permitir que o psicólogo registre devolutivas comportamentais direcionadas ao paciente. | Funcional | Acompanhamento | Psicólogo – Acompanhamento / Diary Service – Devolutivas e Atividades | Média |
| RF-011 | O sistema deve permitir que o psicólogo registre atividades recomendadas ao paciente no contexto do tratamento em andamento. | Funcional | Acompanhamento | Psicólogo – Acompanhamento / Diary Service – Devolutivas e Atividades | Média |
| RF-012 | O sistema deve disponibilizar um canal de comunicação via chat entre paciente e psicólogo vinculados. | Funcional | Chat | Paciente – Chat / Psicólogo – Chat | Média |
| RF-013 | O sistema deve analisar automaticamente cada frase das entradas do diário, identificando a emoção predominante e sua intensidade, utilizando um modelo de inteligência artificial. | Funcional | Análise por IA | AI Service – Análise Emocional | Média |
| RF-014 | O sistema deve determinar a emoção predominante de cada entrada do diário com base nas intensidades identificadas pelo modelo de inteligência artificial. | Funcional | Análise por IA | AI Service – Análise Emocional | Média |

## Requisitos Não Funcionais

| ID | Descrição | Tipo | Categoria | Origem (Processo) | Prioridade |
|---|---|---|---|---|---|
| RNF-001 | A aplicação deve funcionar corretamente em navegadores e dispositivos móveis. | Não Funcional | Portabilidade | Restrição RST-002 | Alta |
| RNF-002 | O sistema deve ser compatível com navegadores modernos (Chrome, Firefox e Edge). | Não Funcional | Portabilidade | Restrição RST-002 | Média |
| RNF-003 | O sistema deve garantir segurança na autenticação, exigindo senha com no mínimo 6 caracteres e armazenamento seguro. | Não Funcional | Segurança | Auth Service – Gerenc. Usuários | Alta |
| RNF-004 | O sistema deve proteger dados sensíveis, garantindo que apenas usuários autorizados acessem informações do diário. | Não Funcional | Segurança | Restrição RST-003 | Alta |
| RNF-005 | O sistema deve responder às requisições do usuário em tempo aceitável. | Não Funcional | Desempenho | Todos os processos | Média |
| RNF-006 | A interface deve seguir boas práticas de usabilidade, sendo simples e intuitiva. | Não Funcional | Usabilidade | Público-alvo (pacientes e psicólogos) | Alta |

---

## Indicadores de desempenho e metas para o negócio

O acompanhamento do desempenho do VibeCheck é realizado por meio de cinco indicadores de desempenho, para medir engajamento do paciente, engajamento do psicólogo, crescimento da plataforma e desempenho técnico.

### KPI 1 — Frequência de Registro no Diário

**Descrição:** É o percentual de dias do mês em que o paciente registrou pelo menos uma entrada no diário. Mostra o quanto o paciente está engajado com a plataforma e a consistência do hábito de registrar as emoções.

**Fórmula:** (dias com pelo menos uma entrada / total de dias do mês) × 100

**Meta:** ≥ 50% dos dias do mês

### KPI 2 — Taxa de Visualização de Devolutivas

**Descrição:** Percentual de devolutivas registradas pelo psicólogo que foram visualizadas pelo paciente. Mede se a comunicação entre psicólogo e paciente está consistente dentro da plataforma.

**Fórmula:** (devolutivas visualizadas / total de devolutivas registradas) × 100

**Meta:** ≥ 80%

### KPI 3 — Usuários Ativos por Mês

**Descrição:** Número de usuários, pacientes e psicólogos, que interagiram pelo menos uma vez na plataforma durante o mês. Mede o crescimento e a retenção de usuários ao longo do tempo.

**Fórmula:** contagem de usuários com ao menos uma ação registrada no período

**Meta progressiva:**
Nesse caso, consideramos a partir do início, com o lançamento da aplicação. Espera-se um crescimento progressivo.

| Período | Meta |
|---|---|
| Mês 1 – 3 | ≥ 100 usuários ativos/mês |
| Mês 4 – 6 | ≥ 200 usuários ativos/mês |
| Mês 7 – 12 | ≥ 500 usuários ativos/mês |

### KPI 4 — Taxa de Leitura de Entradas pelo Psicólogo

**Descrição:** Percentual de entradas do diário que foram lidas pelo psicólogo dentro de um prazo de 48 horas após registrar no sistema. Mede o interesse do profissional e a qualidade do acompanhamento entre as sessões.

**Fórmula:** (entradas lidas em até 48h / total de entradas registradas) × 100

**Meta:** ≥ 70%

### KPI 5 — Disponibilidade Mensal da Plataforma

**Descrição:** Percentual de tempo em que a plataforma este funcional durante o mês. Como o VibeCheck lida com saúde mental, a disponibilidade do sistema é algo crítico, pois espera-se que esteja acessível a pacientes em momentos de crise.

**Fórmula:** (tempo total − tempo de indisponibilidade) / tempo total × 100

**Meta:** ≥ 99,5%

---

Abaixo, tem-se uma imagem de um [dashboard interativo](https://zingy-centaur-f9070a.netlify.app/) com dados simulados das métricas de desempenho

 <img width="1080" height="2074" alt="FireShot Capture 001 - Document -  127 0 0 1" src="https://github.com/user-attachments/assets/8c68c4b9-9d2e-49d2-9b37-73b7b637da3d" />


---


# Clientes

A aplicação possui dois tipos de clientes:

- Web
- Mobile

Ambos consomem a API através de seus respectivos **BFFs**.

### Tecnologias do Frontend

- React (Web)
- React Native (Mobile)

---

# API Gateway

A API Gateway é o ponto de entrada único para todas as requisições dos clientes,
sendo da aplicação web ou mobile.

Ela é responsável por:
- Rotear as requisições para os microserviços correspondentes
- Validar o token JWT antes de repassar requisições para os microserviços
- Repassar o header Authorization intacto para os microserviços
- Combinar respostas de múltiplos microserviços quando necessário

A autorização é responsabilidade de cada microserviço individualmente.

Foi desenvolvida utilizando **.NET**.

---

# Microserviços

## VibeCheck.Auth

Responsável pela **autenticação e autorização dos usuários**.

### Funções principais

- Login
- Validação de credenciais
- Geração de tokens de autenticação

### Banco de dados

- `Auth.DB`

---

## VibeCheck.User

Responsável pelo **gerenciamento de usuários da plataforma**.

### Funções principais

- Cadastro de usuários
- Atualização de perfil
- Consulta de informações do usuário

### Banco de dados

- `User.DB`

---

## VibeCheck.Message

Responsável pelo **envio e gerenciamento de mensagens entre usuários**.

### Funções principais

- Envio de mensagens
- Recebimento de mensagens
- Histórico de conversas

### Banco de dados

- `Message.DB`

Este serviço também se comunica com o serviço **NLP** para análise de conteúdo das mensagens.

---

## VibeCheck.NLP

Responsável pelo **processamento de linguagem natural (NLP)** das mensagens enviadas pelos usuários.

### Funções principais

- Análise de texto
- Classificação de sentimentos
- Processamento de conteúdo

### Tecnologias utilizadas

- .NET
- Python

---

## VibeCheck.Diario

Responsável pelo **gerenciamento do diário emocional dos usuários**.

### Funções principais

- Registro de entradas no diário
- Consulta de histórico emocional
- Armazenamento de registros

### Banco de dados

- `Diario.DB`

---

# Banco de Dados

Cada microserviço possui **seu próprio banco de dados**, garantindo:

- Baixo acoplamento
- Independência entre serviços
- Escalabilidade

Os bancos utilizados são baseados em **MongoDB**.

---

# Tecnologias Utilizadas

## Backend

- .NET
- Python (para NLP)

## Frontend

- React
- React Native

## Banco de Dados

- MongoDB

## Diagrama de Classes

O diagrama de classes construído abaixo ilustra graficamente como será a estrutura do software, e como cada uma das classes da sua estrutura estarão interligadas. Essas classes servem de modelo para materializar os objetos que executarão na memória.

<img width="764" height="1118" alt="diagrama de classe vibecheck" src="https://github.com/user-attachments/assets/d54e8de2-5f46-4d9e-abf3-6ce65aecc937" />

## Documentação do Banco de Dados MongoDB

Este documento descreve a estrutura e o esquema do banco de dados não relacional utilizado por nosso projeto, baseado em MongoDB. O MongoDB é um banco de dados NoSQL que armazena dados em documentos JSON (ou BSON, internamente), permitindo uma estrutura flexível e escalável para armazenar e consultar dados.

## Esquema do Banco de Dados
### Coleção: users
 
Armazena as informações dos usuários do sistema, incluindo pacientes e psicólogos.
 
#### Estrutura do Documento
 
```json
{
    "_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "name": "João Silva",
    "email": "joao@email.com",
    "passwordHash": "hash_da_senha",
    "role": "paciente",
    "cpf": "123.456.789-00",
    "crp": null,
    "dataNascimento": "1995-06-15",
    "createdAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-01T10:00:00Z"
}
```

#### Descrição dos Campos
 
- **_id:** Identificador único do usuário gerado automaticamente pelo MongoDB.
- **name:** Nome completo do usuário.
- **email:** Endereço de e-mail do usuário, utilizado para autenticação.
- **passwordHash:** Hash da senha do usuário gerado via BCrypt.
- **role:** Papel do usuário no sistema. Valores possíveis: `"paciente"` ou `"psicologo"`.
- **cpf:** CPF do usuário. Preenchido apenas quando `role` é `"paciente"`.
- **crp:** Número de registro do psicólogo no CRP. Preenchido apenas quando `role` é `"psicologo"`.
- **dataNascimento:** Data de nascimento do usuário.
- **createdAt:** Data e hora de criação do usuário.
- **updatedAt:** Data e hora da última atualização dos dados do usuário.

### Coleção: links
 
Armazena os vínculos de acompanhamento terapêutico entre pacientes e psicólogos.
 
#### Estrutura do Documento
 
```json
{
    "_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a2')",
    "pacienteId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "psicologoId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a3')"
}
```
 
#### Descrição dos Campos
 
- **_id:** Identificador único do vínculo gerado automaticamente pelo MongoDB.
- **pacienteId:** Referência ao identificador do paciente na coleção `users`.
- **psicologoId:** Referência ao identificador do psicólogo na coleção `users`.


### Coleção: diaryEntries
 
Armazena as entradas do diário registradas pelos pacientes, incluindo a análise emocional gerada pelo modelo de inteligência artificial.
 
#### Estrutura do Documento
 
```json
{
    "_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a4')",
    "pacienteId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "texto": "Hoje me senti muito ansioso durante o trabalho...",
    "analiseIA": {
        "emocaoPredominante": "ansiedade",
        "frases": [
            {
                "trecho": "me senti muito ansioso durante o trabalho",
                "emocao": "ansiedade",
                "intensidade": 8
            },
            {
                "trecho": "mas consegui terminar minhas tarefas",
                "emocao": "determinacao",
                "intensidade": 5
            }
        ]
    },
    "createdAt": "2025-01-01T10:00:00Z"
}
```
 
#### Descrição dos Campos
 
- **_id:** Identificador único da entrada gerado automaticamente pelo MongoDB.
- **pacienteId:** Referência ao identificador do paciente na coleção `users` do `auth-service`.
- **texto:** Texto livre registrado pelo paciente.
- **analiseIA:** Objeto contendo a análise emocional gerada pelo `ai-service`. Inicia como `null` e é preenchido após o processamento.
  - **emocaoPredominante:** Emoção com maior intensidade identificada na entrada.
  - **frases:** Lista de frases analisadas individualmente, cada uma contendo:
    - **trecho:** Trecho do texto original analisado.
    - **emocao:** Emoção identificada no trecho.
    - **intensidade:** Intensidade da emoção identificada, em uma escala numérica.
- **createdAt:** Data e hora de criação da entrada.

### Coleção: feedbacks
 
Armazena as devolutivas registradas pelos psicólogos para seus pacientes.
 
#### Estrutura do Documento
 
```json
{
    "_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a5')",
    "pacienteId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "psicologoId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a3')",
    "texto": "Percebi uma evolução significativa nos seus relatos esta semana...",
    "createdAt": "2025-01-01T10:00:00Z"
}
```
 
#### Descrição dos Campos
 
- **_id:** Identificador único da devolutiva gerado automaticamente pelo MongoDB.
- **pacienteId:** Referência ao identificador do paciente na coleção `users` do `auth-service`.
- **psicologoId:** Referência ao identificador do psicólogo na coleção `users` do `auth-service`.
- **texto:** Texto da devolutiva registrada pelo psicólogo.
- **createdAt:** Data e hora de criação da devolutiva.

### Coleção: activities
 
Armazena as atividades recomendadas pelos psicólogos para seus pacientes.
 
#### Estrutura do Documento
 
```json
{
    "_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a6')",
    "pacienteId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "psicologoId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a3')",
    "texto": "Praticar respiração diafragmática por 10 minutos ao acordar.",
    "dataEntrega": "2025-01-08T00:00:00Z",
    "estaConcluida": false,
    "createdAt": "2025-01-01T10:00:00Z"
}
```
 
#### Descrição dos Campos
 
- **_id:** Identificador único da atividade gerado automaticamente pelo MongoDB.
- **pacienteId:** Referência ao identificador do paciente na coleção `users` do `auth-service`.
- **psicologoId:** Referência ao identificador do psicólogo na coleção `users` do `auth-service`.
- **texto:** Descrição da atividade recomendada pelo psicólogo.
- **dataEntrega:** Data limite para conclusão da atividade.
- **estaConcluida:** Indica se o paciente concluiu a atividade. Inicia como `false`.
- **createdAt:** Data e hora de criação da atividade.

### Coleção: chats
 
Armazena os canais de comunicação entre pacientes e psicólogos vinculados.
 
#### Estrutura do Documento
 
```json
{
    "_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a7')",
    "pacienteId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "psicologoId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a3')",
    "createdAt": "2025-01-01T10:00:00Z",
    "ultimaMensagemEm": "2025-01-05T14:30:00Z"
}
```
 
#### Descrição dos Campos
 
- **_id:** Identificador único do chat gerado automaticamente pelo MongoDB.
- **pacienteId:** Referência ao identificador do paciente na coleção `users` do `auth-service`.
- **psicologoId:** Referência ao identificador do psicólogo na coleção `users` do `auth-service`.
- **createdAt:** Data e hora de criação do canal de chat.
- **ultimaMensagemEm:** Data e hora da última mensagem enviada no chat. Utilizado para ordenar a lista de conversas por recência.

### Coleção: messages
 
Armazena as mensagens trocadas entre pacientes e psicólogos dentro de um canal de chat.
 
#### Estrutura do Documento
 
```json
{
    "_id": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a8')",
    "chatId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a7')",
    "autorId": "ObjectId('5f7e1bbf9b2a4f1a9c38b9a1')",
    "texto": "Boa tarde, doutora! Tenho uma dúvida sobre a atividade.",
    "lida": false,
    "createdAt": "2025-01-05T14:30:00Z"
}
```
 
#### Descrição dos Campos
 
- **_id:** Identificador único da mensagem gerado automaticamente pelo MongoDB.
- **chatId:** Referência ao identificador do chat na coleção `chats`.
- **autorId:** Referência ao identificador do usuário que enviou a mensagem na coleção `users` do `auth-service`.
- **texto:** Conteúdo da mensagem enviada.
- **lida:** Indica se a mensagem foi lida pelo destinatário. Inicia como `false`.
- **createdAt:** Data e hora de envio da mensagem.


## Tecnologias Utilizadas

O sistema foi desenvolvido com um conjunto de tecnologias distribuídas entre os diferentes serviços da arquitetura de microsserviços.

| Categoria | Tecnologia | Finalidade |
|---|---|---|
| Linguagens | C# | Back-end dos microsserviços principais |
| Linguagens | Python | Serviço de inteligência artificial |
| Linguagens | JavaScript / JSX | Front-end web e mobile |
| Framework Back-end | ASP.NET Core (.NET 10) | Desenvolvimento das APIs REST |
| Framework Back-end | FastAPI | Exposição da API do serviço de IA |
| Framework Front-end | React | Aplicação web |
| Framework Mobile | React Native | Aplicação mobile |
| Ferramenta de Build | Vite | Build e ambiente de desenvolvimento web |
| ORM | Entity Framework Core | Mapeamento objeto-relacional nos serviços .NET |
| Banco de Dados | MongoDB | Banco NoSQL de todos os microsserviços |
| NLP | spaCy (`pt_core_news_sm`) | Segmentação de frases em português |
| NLP | HuggingFace Inference API | Consumo dos modelos de IA via API |
| Modelo de IA | `oliverguhr/fullstop-punctuation-multilang-large` | Pontuação automática de textos sem pontuação |
| Modelo de IA | `j-hartmann/emotion-english-distilroberta-base` | Classificação de emoções por frase (inglês) |
| Tradução | deep-translator (Google Translate) | Tradução automática português → inglês antes da classificação |
| Hospedagem | Render | Deploy dos microsserviços e da API de IA |
| Containerização | Docker | Empacotamento dos serviços |
| Controle de Versão | Git + GitHub | Versionamento e repositório remoto |
| Gerenciamento | GitHub Projects | Organização e acompanhamento de tarefas |
| IDE Back-end | Visual Studio 2022 | Desenvolvimento dos microsserviços .NET |
| IDE Front-end / Mobile | Visual Studio Code | Desenvolvimento do front-end web e mobile |
| IDE IA | PyCharm | Desenvolvimento do serviço de IA em Python |
| Testes de API | Postman | Testes e validação das rotas |
| Prototipação | Figma | Design e prototipação de interfaces |
| Comunicação | Microsoft Teams | Comunicação da equipe |

O [diagrama](https://www.figma.com/design/qj9ZWDsf0oN7BXuuKHIaz2/Diagrama-Arquitetura-VibeCheck?node-id=1-3&t=vWUC6RolCOE6PnRn-1) abaixo explica como as tecnologias selecionadas interagem e como é realizado o fluxo do usuário no sistema

<img width="982" height="963" alt="arq tecnica vibecheck" src="https://github.com/user-attachments/assets/dd62e76a-b240-4df5-a64d-82cbeec72f9c" />

## Hospedagem

As APIs `Auth`, `Diario`, `Psychology`, `Chat` e `NLP` foram hospedadas na plataforma [Render](https://render.com/). E os bancos de dados NoSQL estão hospedados na plataforma [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).

## Qualidade de Software

Com base na norma ISO/IEC 25010, a equipe selecionou as subcaracterísticas de qualidade mais relevantes para o contexto do VibeCheck, um sistema de saúde mental que lida com dados sensíveis, dois perfis de usuário diferentes e arquitetura de microsserviços.

| Característica | Subcaracterística | Justificativa | Métricas | Testes |
|---|---|---|---|---|
| Adequação Funcional | Completude Funcional | O sistema atende dois perfis com necessidades distintas (paciente e psicólogo), e toda funcionalidade mapeada nos requisitos precisa estar implementada e verificada. | % de requisitos cobertos por testes, e nº de casos de uso verificados | Sistema, Integração |
| Confiabilidade | Disponibilidade | O paciente pode precisar usar o sistema em momentos de crise emocional, logo a queda de um serviço não deve comprometer os demais. | % de uptime por serviço, e nº de falhas registradas por período | Sistema |
| Segurança | Confidencialidade | Dados clínicos e emocionais são sensíveis e sigilosos. Um paciente não deve acessar dados de outro, e o psicólogo só acessa dados de pacientes vinculados a ele. | Cobertura de testes nas camadas de autenticação e autorização, e nº de acessos não autorizados bloqueados nos testes | Unitário, Integração, Sistema |
| Manutenibilidade | Modularidade | Cada microsserviço deve evoluir de forma independente. Alterar um deles não deve gerar falhas nos outros. | Nº de falhas introduzidas em outros serviços após alteração, e cobertura de testes unitários por serviço | Unitário, Integração |
| Usabilidade | Apreensibilidade | O perfil de usuário inclui pessoas em sofrimento emocional com diferentes níveis de familiaridade com tecnologia. A interface deve ser usável por qualquer pessoa, sem treinamento necessário. | Nº de erros cometidos durante testes de sistema, e tempo médio para completar tarefas básicas | Sistema |
| Adequação Funcional | Correção Funcional | A análise de IA precisa produzir resultados coerentes, já que classificações incorretas podem influenciar a interpretação clínica do psicólogo. | % de classificações consideradas coerentes em entradas de teste, e nº de falhas funcionais identificadas | Sistema |
