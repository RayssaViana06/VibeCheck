# Testes Unitários no Backend

## O que são Testes Unitários?

Testes unitários são testes automatizados escritos e executados para garantir que pequenas partes individuais do código (unidades) funcionem conforme esperado. No contexto do desenvolvimento backend, isso geralmente significa testar funções, métodos, ou classes de maneira isolada, sem dependências externas como bancos de dados ou serviços web.

## Por que são Importantes?

Testes unitários ajudam a:

- Identificar problemas de maneira precoce no ciclo de desenvolvimento.
- Garantir que o código continue funcionando após alterações (regressões).
- Facilitar o processo de refatoração.
- Melhorar a confiabilidade e a qualidade do software.

## Configuração do Ambiente

Para começar a escrever testes unitários em um projeto backend utilizando C#, siga os passos abaixo:

1. **Instale o .NET SDK**: Certifique-se de ter o [.NET SDK](https://dotnet.microsoft.com/download) instalado.

2. **Crie um projeto de testes**: No terminal, navegue até o diretório do seu projeto e execute o seguinte comando para criar um projeto de testes usando xUnit (um framework popular de testes unitários para .NET):

    ```bash
    dotnet new xunit -o tests
    ```

3. **Adicione uma referência ao seu projeto principal**: No diretório do projeto de testes, adicione uma referência ao seu projeto principal:

    ```bash
    dotnet add reference ../src/MyProject.csproj
    ```

4. **Organize sua estrutura de diretórios**: Uma estrutura comum de projeto é a seguinte:

    ```
    MyProject/
    ├── src/
    │   └── MyProject.cs
    └── tests/
        └── MyProject.Tests.cs
    ```

## Exemplo de Teste Unitário

Aqui está um exemplo simples de um teste unitário em C# usando xUnit. Vamos supor que temos um método na classe `Calculator` que soma dois números.

```csharp
// src/MyProject.cs

namespace MyProject
{
    public class Calculator
    {
        public int Add(int a, int b)
        {
            return a + b;
        }
    }
}

````

## Testes Unitários — VibeCheck.NLP (Python / FastAPI)
### Diretório
    backend/
    ├── AI_API/
        └── main.py
        └── tests/
            └── test_main.py
### Requisitos testados

| RF | Rota | Função de Teste | Comportamento Testado | Status Esperado |
|---|---|---|---|---|
| RF-013, RF-014 | `POST /analisar` | `test_texto_vazio` | Deve retornar erro quando o texto estiver vazio | 400 |
| RF-001 | `POST /analisar` | `test_sem_api_key` | Deve rejeitar requisição sem a chave de autenticação | 401 |
| RF-001 | `POST /analisar` | `test_api_key_invalida` | Deve rejeitar requisição com chave de autenticação inválida | 403 |
| RF-013, RF-014 | `POST /analisar` | `test_retorno_tem_campos_esperados` | A resposta deve conter os campos `entry_id`, `patient_id` e `frases` | 200 |
| RF-013, RF-014 | `POST /analisar` | `test_ids_retornados_corretamente` | Os IDs retornados devem ser iguais aos enviados na requisição | 200 |
| RF-013 | `POST /analisar` | `test_frases_tem_estrutura_correta` | Cada frase analisada deve conter `frase`, `emocao_dominante`, `intensidade` e `todas_emocoes` | 200 |


## Testes Unitários — VibeCheck.DiarioService (C# / .NET / xUnit)

## Diretório

```
src/
└── Back-End/
    └── VibeCheck/
        ├── VibeCheck_v1.csproj
        └── tests/
            └── DiarioService.Tests/
                └── DiaryControllerTests.cs
```

### Requisitos testados

| RF | Rota | Função de Teste | Comportamento Testado | Status Esperado |
|---|---|---|---|---|
| RF-005 | `POST /api/diary` | `test_criar_entrada_sem_token` | Deve rejeitar requisição sem token de autenticação | 401 |
| RF-005 | `POST /api/diary` | `test_criar_entrada_sem_texto` | Deve retornar erro ao enviar body sem o campo `texto` | 400 |
| RF-005 | `POST /api/diary` | `test_criar_entrada_valida` | Deve retornar 201 ao salvar entrada com texto válido | 201 |
| RF-005 | `POST /api/diary` | `test_paciente_id_do_token` | Deve salvar o `pacienteId` extraído do token, ignorando qualquer valor enviado no body | 201 |
| RF-006 | `GET /api/diary/historico` | `test_historico_sem_token` | Deve rejeitar requisição sem token de autenticação | 401 |
| RF-006 | `GET /api/diary/historico` | `test_historico_retorna_entradas_do_paciente` | Deve retornar apenas as entradas do paciente autenticado | 200 |
| RF-006 | `GET /api/diary/historico` | `test_historico_vazio` | Deve retornar lista vazia se paciente não tiver entradas | 200 |
| RF-013, RF-014 | `POST /api/diary` | `test_analise_ia_salva_apos_processamento` | Deve salvar o campo `analiseIA` na entrada após processamento em background | 201 |
| RF-013, RF-014 | `POST /api/diary` | `test_entrada_salva_mesmo_com_falha_ia` | Deve manter a entrada no banco mesmo se o serviço de IA falhar | 201 |


## Testes Unitários — VibeCheck.AuthService (C# / .NET / xUnit)

## Diretório

```
src/
└── auth-service/
    ├── VibeCheck.csproj
    └── AuthService.Tests/
        ├── UserServiceTests.cs
        ├── TokenServiceTests.cs
        ├── UserValidationTests.cs
        └── UserControllerTests.cs
```

### Requisitos testados

| RF | Rota | Função de Teste | Comportamento Testado | Status Esperado |
|---|---|---|---|---|
| RF-001 | POST /api/User/register | `CreateAsync_DeveSalvarUsuario` | Deve salvar o usuário corretamente no banco de dados | 201 |
| RF-001, RF-002, RF-003 | POST /api/User/register | `HashSenha_DeveGerarHashDiferenteDaSenhaOriginal` | A senha armazenada deve ser um hash BCrypt, diferente da senha original | — |
| RF-001 | POST /api/User/login | `VerificarSenha_DeveRetornarTrueParaSenhaCorreta` | Deve autenticar com sucesso quando a senha informada for correta | 200 |
| RF-001 | POST /api/User/login | `VerificarSenha_DeveRetornarFalseParaSenhaErrada` | Deve rejeitar autenticação quando a senha informada for incorreta | 401 |
| RF-001 | POST /api/User/login | `GenerateToken_DeveRetornarTokenValido` | Deve gerar um token JWT válido com três partes separadas por ponto | 200 |
| RF-001 | POST /api/User/login | `GenerateToken_DeveTerIssuerCorreto` | O token gerado deve conter o Issuer correto (`auth-service`) | 200 |
| RF-001 | POST /api/User/login | `GenerateToken_DeveConterRoleCorreta` | O token gerado deve conter a role correta do usuário (`paciente` ou `psicologo`) | 200 |
| RF-002 | POST /api/User/register | `Validacao_PacienteSemCpf_DeveSerInvalido` | Deve rejeitar cadastro de paciente sem CPF | 400 |
| RF-003 | POST /api/User/register | `Validacao_PsicologoSemCrp_DeveSerInvalido` | Deve rejeitar cadastro de psicólogo sem CRP | 400 |
| RF-001, RF-002, RF-003 | POST /api/User/register | `Validacao_SenhaCurta_DeveSerInvalida` | Deve rejeitar cadastro com senha menor que 6 caracteres | 400 |
| RF-002 | POST /api/User/register | `Register_PacienteSemCpf_DeveRetornar400` | Deve retornar 400 ao tentar cadastrar paciente sem CPF | 400 |
| RF-003 | POST /api/User/register | `Register_PsicologoSemCrp_DeveRetornar400` | Deve retornar 400 ao tentar cadastrar psicólogo sem CRP | 400 |
| RF-001, RF-002, RF-003 | POST /api/User/register | `Register_SenhaCurta_DeveRetornar400` | Deve retornar 400 ao tentar cadastrar com senha inválida | 400 |
| RF-001, RF-002, RF-003 | POST /api/User/register | `Register_RoleInvalido_DeveRetornar400` | Deve retornar 400 ao tentar cadastrar com role diferente de `paciente` ou `psicologo` | 400 |
| RF-001 | POST /api/User/login | `Login_SenhaErrada_DeveRetornar401` | Deve retornar 401 ao tentar autenticar com senha incorreta | 401 |


# Testes Unitários — VibeCheck.Message (C# / .NET 10 / xUnit)

## Diretório

```text
src/
└── Back-End/
    └── VibeCheck.Message/
        ├── Message.Api/
        │   ├── Program.cs
        │   └── Hubs/
        │       └── MessageProvider.cs
        └── Message.TestUnit/
            ├── Controllers/
            │   ├── BuscarChatControllerTest.cs
            │   ├── CriarChatControllerTest.cs
            │   └── DeletarChatControllerTest.cs
            └── Hubs/
                └── MessageProviderTest.cs
```

## Requisitos testados

| RF | Rota | Função de Teste | Comportamento Testado | Status Esperado |
|---|---|---|---|---|
| RF-012 | `GET /chats/buscar-chats/{id}` | `BuscarChats_DeveRetornarOk_QuandoMediatorExecutarComSucesso` | Deve retornar resultado `Ok` quando o `IMediator` executa com sucesso | 200 |
| RF-012 | `GET /chats/buscar-chats/{id}` | `BuscarChats_DeveRetornarProblem_QuandoMediatorLancarExcecao` | Deve retornar `Problem` quando o `IMediator` lança exceção | 500 |
| RF-012 | `POST /chats/criar-chat` | `CriarChat_DeveRetornarOk_QuandoMediatorExecutarComSucesso` | Deve retornar `Ok` com `CriarChatResponse` quando o `IMediator` executa com sucesso | 200 |
| RF-012 | `POST /chats/criar-chat` | `CriarChat_DeveRetornarProblem_QuandoMediatorLancarExcecao` | Deve retornar `Problem` quando ocorre falha ao criar chat | 500 |
| RF-012 | `DELETE /chats/deletar-chat/{id}` | `DeletarChat_DeveRetornarOk_QuandoMediatorExecutarComSucesso` | Deve retornar `Ok` quando o comando de exclusão é executado com sucesso | 200 |
| RF-012 | `DELETE /chats/deletar-chat/{id}` | `DeletarChat_DeveRetornarProblem_QuandoMediatorLancarExcecao` | Deve retornar `Problem` quando ocorre falha ao deletar chat | 500 |
| RF-012 | `HUB /message/hub` (`SendMessage`) | `SendMessage_DeveSalvarMensagemENotificarUsuarioDestino` | Deve salvar a mensagem e notificar o usuário de destino via `ReceiveMessage` | Sucesso (sem exceção) |

---

# Testes Unitários — VibeCheck.DiarioService (C# / .NET / xUnit)

## Diretório

```
src/
└── Back-End/
    └── VibeCheck.activities/
        └── tests/
            └── ActivitiesControllerTests.cs
            └── DiaryControllerTests.cs
```

---

## Requisitos Testados

### RF-007 — Psicólogo visualiza entradas do diário de seus pacientes
**Rota:** `GET /api/diary?patientId={id}`

| RF | Rota | Função de Teste | Comportamento Testado | Status Esperado |
|---|---|---|---|---|
| RF-007 | `GET /api/diary?patientId={id}` | `RF007_test_visualizar_diario_sem_token` | Deve rejeitar requisição sem token de autenticação | 401 |
| RF-007 | `GET /api/diary?patientId={id}` | `RF007_test_visualizar_diario_com_token_paciente` | Deve rejeitar quando o token pertence a um paciente (role inválida) | 403 |
| RF-007 | `GET /api/diary` | `RF007_test_visualizar_diario_sem_patient_id_na_query` | Deve retornar erro ao chamar sem o parâmetro `patientId` na query string | 400 |
| RF-007 | `GET /api/diary?patientId={id}` | `RF007_test_visualizar_diario_psicologo_nao_vinculado` | Deve rejeitar quando o psicólogo não está vinculado ao paciente | 403 / 404 |
| RF-007 | `GET /api/diary?patientId={id}` | `RF007_test_visualizar_diario_psicologo_vinculado_retorna_200` | Deve retornar 200 com a lista de entradas quando o psicólogo está vinculado | 200 |
| RF-007 | `GET /api/diary?patientId={id}` | `RF007_test_visualizar_diario_ordem_cronologica` | Deve retornar as entradas ordenadas cronologicamente (mais antiga primeiro) | 200 + assert |
| RF-007 | `GET /api/diary?patientId={id}` | `RF007_test_visualizar_diario_paciente_sem_entradas_retorna_lista_vazia` | Deve retornar lista vazia quando o paciente não possui entradas no diário | 200 + `[]` |

---

### RF-011 — Psicólogo registra atividades recomendadas ao paciente
**Rota:** `POST /api/activities`

| RF | Rota | Função de Teste | Comportamento Testado | Status Esperado |
|---|---|---|---|---|
| RF-011 | `POST /api/activities` | `RF011_test_registrar_atividade_sem_token` | Deve rejeitar requisição sem token de autenticação | 401 |
| RF-011 | `POST /api/activities` | `RF011_test_registrar_atividade_com_token_paciente` | Deve rejeitar quando o token pertence a um paciente (role inválida) | 403 |
| RF-011 | `POST /api/activities` | `RF011_test_registrar_atividade_sem_descricao` | Deve retornar erro ao enviar body sem o campo `description` | 400 |
| RF-011 | `POST /api/activities` | `RF011_test_registrar_atividade_sem_patient_id` | Deve retornar erro ao enviar body sem o campo `patientId` | 400 |
| RF-011 | `POST /api/activities` | `RF011_test_registrar_atividade_psicologo_nao_vinculado` | Deve rejeitar quando o psicólogo não está vinculado ao paciente | 403 / 404 |
| RF-011 | `POST /api/activities` | `RF011_test_registrar_atividade_valida_retorna_201` | Deve retornar 201 ao registrar uma atividade válida para um paciente vinculado | 201 |
| RF-011 | `POST /api/activities` | `RF011_test_psicologo_id_extraido_do_token` | Deve salvar o `psychologistId` extraído do token, ignorando qualquer valor enviado no body | 201 + assert |

---

## Testes Unitários — VibeCheck.Feedback e VibeCheck.DiarioFiltro (C# / .NET 10 / xUnit)

### Diretório
```
src/
└── Back-End/
    ├── apiVibeCheckFeedMs/
    │   └── tests/
    │       └── FeedbackServiceTests.cs
    └── apiDiarioFiltro/
        └── tests/
            └── FiltroServiceTests.cs
```
### Requisitos testados

| RF | Rota | Função de Teste | Comportamento Testado | Status Esperado |
|----|------|-----------------|-----------------------|-----------------|
| RF-010 | `POST /api/Feedback` | `CreateAsync_DeveRetornarFeedback_QuandoDadosValidos` | Deve retornar feedback ao criar com dados válidos | 201 |
| RF-010 | `POST /api/Feedback` | `CreateAsync_DeveLancarExcecao_QuandoTextoVazio` | Deve lançar exceção quando texto vazio | 400 |
| RF-010 | `POST /api/Feedback` | `CreateAsync_DeveLancarExcecao_QuandoTextoMenorQue5Caracteres` | Deve lançar exceção quando texto menor que 5 caracteres | 400 |
| RF-010 | `POST /api/Feedback` | `CreateAsync_DeveLancarExcecao_QuandoTextoMaiorQue500Caracteres` | Deve lançar exceção quando texto maior que 500 caracteres | 400 |
| RF-010 | `POST /api/Feedback` | `CreateAsync_DeveLancarExcecao_QuandoPacienteIdVazio` | Deve lançar exceção quando pacienteId vazio | 400 |
| RF-010 | `DELETE /api/Feedback/meus/{id}` | `OcultarParaPacienteAsync_DeveOcultar_QuandoPacienteCorreto` | Deve ocultar devolutiva do paciente correto | 204 |
| RF-010 | `DELETE /api/Feedback/meus/{id}` | `OcultarParaPacienteAsync_DeveLancarExcecao_QuandoFeedbackNaoEncontrado` | Deve lançar exceção quando feedback não encontrado | 404 |
| RF-010 | `DELETE /api/Feedback/meus/{id}` | `OcultarParaPacienteAsync_DeveLancarExcecao_QuandoPacienteErrado` | Deve lançar exceção quando paciente não autorizado | 403 |
| RF-010 | `DELETE /api/Feedback/{id}` | `DeleteAsync_DeveExcluir_QuandoPsicologoCorreto` | Deve excluir devolutiva do psicólogo correto | 204 |
| RF-010 | `DELETE /api/Feedback/{id}` | `DeleteAsync_DeveLancarExcecao_QuandoPsicologoErrado` | Deve lançar exceção quando psicólogo não autorizado | 403 |
| RF-008 | `GET /api/diary/filter?dataEspecifica={data}` | `Filtrar_DeveRetornarEntradas_QuandoDataEspecificaValida` | Deve retornar entradas do dia específico | 200 |
| RF-008 | `GET /api/diary/filter?dataInicio={data}&dataFim={data}` | `Filtrar_DeveRetornarEntradas_QuandoDadosValidos` | Deve retornar entradas do intervalo | 200 |
| RF-008 | `GET /api/diary/filter` | `Filtrar_DeveLancarExcecao_QuandoPacienteIdVazio` | Deve lançar exceção quando pacienteId vazio | 400 |
| RF-008 | `GET /api/diary/filter?dataInicio={data}&dataFim={data}` | `Filtrar_DeveLancarExcecao_QuandoDataInicioMaiorQueDataFim` | Deve lançar exceção quando data início maior que fim | 400 |
| RF-008 | `GET /api/diary/filter?dataEspecifica={data}` | `Filtrar_DeveRetornarListaVazia_QuandoNaoHaEntradas` | Deve retornar lista vazia quando não há entradas | 200 |

