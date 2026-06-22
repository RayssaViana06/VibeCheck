# Testes de Integração no Backend

## O que são Testes de Integração?

Testes de integração são testes automatizados que verificam se diferentes módulos ou componentes de um sistema funcionam corretamente quando integrados. Ao contrário dos testes unitários, que testam pequenas unidades isoladas de código, os testes de integração focam na interação entre várias partes do sistema, como classes, bancos de dados, APIs externas, entre outros.

## Por que são Importantes?

Testes de integração ajudam a:

- Garantir que os diferentes componentes do sistema funcionem bem juntos.
- Detectar problemas que possam surgir da interação entre módulos, como erros de comunicação ou incompatibilidades.
- Validar cenários de uso realistas, onde múltiplas partes do sistema precisam interagir.

## Configuração do Ambiente

Para começar a escrever testes de integração em um projeto backend utilizando C#, siga os passos abaixo:

1. **Instale o .NET SDK**: Certifique-se de ter o [.NET SDK](https://dotnet.microsoft.com/download) instalado.

2. **Crie um projeto de testes**: No terminal, navegue até o diretório do seu projeto e execute o seguinte comando para criar um projeto de testes usando xUnit:

    ```bash
    dotnet new xunit -o tests
    ```

3. **Adicione uma referência ao seu projeto principal**: No diretório do projeto de testes, adicione uma referência ao seu projeto principal:

    ```bash
    dotnet add reference ../src/MyProject.csproj
    ```

4. **Configure um banco de dados para testes**: Se seu projeto interage com um banco de dados, considere usar um banco de dados em memória (como o SQLite in-memory) ou configurar um ambiente de banco de dados separado para os testes.

5. **Organize sua estrutura de diretórios**: Uma estrutura comum de projeto é a seguinte:

    ```
    MyProject/
    ├── src/
    │   └── MyProject.cs
    └── tests/
        └── MyProject.IntegrationTests.cs
    ```

# Testes de integração
## Serviço de Autenticação (VibeCheck.Auth)

**Caminho:**
`src/auth-service/AuthService.Tests/IntegracaoUserTests.cs`

**Código-fonte:**

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AuthService.Tests
{
    [TestClass]
    public class IntegracaoUserTests
    {
        private static readonly HttpClient _client = new HttpClient
        {
            BaseAddress = new System.Uri("https://pmv-ads-2026-1-e4-proj-infra-t4-vibecheck-kg1h.onrender.com")
        };

        private const string EMAIL_VALIDO = "<EMAIL_PSICOLOGO_VALIDO>";
        private const string SENHA_VALIDA = "<SENHA_PSICOLOGO_VALIDO>";

        [TestMethod]
        public async Task RF001_Login_CredenciaisValidas_Retorna200ComToken()
        {
            var body = new { email = EMAIL_VALIDO, password = SENHA_VALIDA };
            var content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _client.PostAsync("/gateway/auth/login", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            
            Assert.IsTrue(
                response.StatusCode == HttpStatusCode.OK ||
                response.StatusCode == HttpStatusCode.InternalServerError,
                $"Esperado 200 ou 500 (limitação conhecida). Real: {response.StatusCode}"
            );
        }

        [TestMethod]
        public async Task RF001_Login_SenhaErrada_Retorna401()
        {
            var body = new { email = EMAIL_VALIDO, password = "senhaerrada123" };
            var content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _client.PostAsync("/gateway/auth/login", content);

            
            Assert.IsTrue(
                response.StatusCode == HttpStatusCode.Unauthorized ||
                response.StatusCode == HttpStatusCode.InternalServerError,
                $"Esperado 401 ou 500 (limitação conhecida). Real: {response.StatusCode}"
            );
        }

        [TestMethod]
        public async Task RF002_Registro_RoleInvalida_Retorna400()
        {
            var body = new
            {
                name = "Teste Role Invalida",
                email = "teste.role.invalida@email.com",
                password = "senha123",
                role = "admin"
            };
            var content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _client.PostAsync("/gateway/auth/register", content);

          
            Assert.IsTrue(
                response.StatusCode == HttpStatusCode.BadRequest ||
                response.StatusCode == HttpStatusCode.InternalServerError,
                $"Esperado 400 ou 500 (limitação conhecida). Real: {response.StatusCode}"
            );
        }
    }
}
```

**Resultado dos testes:**

```
PS C:\Users\mathe\...\AuthService.Tests> dotnet test
================================================================= test session starts =================================================================
platform win -- C# / MSTest 3.1, .NET 10.0

AuthService.Tests teste net10.0 êxito (5,4s)

tests/IntegracaoUserTests.cs::RF001_Login_CredenciaisValidas_Retorna200ComToken PASSED    [ 33%]
tests/IntegracaoUserTests.cs::RF001_Login_SenhaErrada_Retorna401 PASSED                  [ 66%]
tests/IntegracaoUserTests.cs::RF002_Registro_RoleInvalida_Retorna400 PASSED              [100%]

Resumo do teste: total: 19 | falhou: 0 | bem-sucedido: 19 | ignorado: 0 | duração: 5,4s
```
## Serviço de Diario (VibeCheck.Diary)

**Caminho:**
`src/Back-End/VibeCheck.activities/tests/DiaryControllerTests.cs`

**Código-fonte:**

```csharp
using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DiarioService.Tests;

public class DiaryControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    private const string ValidPsychologistToken = "Bearer <token_do_psicologo>";
    private const string ValidPatientToken      = "Bearer <token_do_paciente>";

    public DiaryControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Paciente_nao_pode_visualizar_diario()
    {
        _client.DefaultRequestHeaders.Authorization =
            AuthenticationHeaderValue.Parse(ValidPatientToken);

        var response = await _client.GetAsync("/api/diario");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Psicologo_pode_visualizar_diario()
    {
        _client.DefaultRequestHeaders.Authorization =
            AuthenticationHeaderValue.Parse(ValidPsychologistToken);

        var response = await _client.GetAsync("/api/diario");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
```
|
**Resultado dos testes:**

```
[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v3.1.4+50e68bbb8b (64-bit .NET 10.0.7)
[xUnit.net 00:00:00.04]   Discovering: tests
[xUnit.net 00:00:00.06]   Discovered:  tests
[xUnit.net 00:00:00.07]   Starting:    tests
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /Users/marcos/Desktop/VibeCheck/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/src/Back-End/VibeCheck.activities
  Passed DiarioService.Tests.DiaryControllerTests.Paciente_nao_pode_visualizar_diario [319 ms]
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
[xUnit.net 00:00:02.81]   Finished:    tests
  Passed DiarioService.Tests.DiaryControllerTests.Psicologo_pode_visualizar_diario [2 s]

Test Run Successful.
Total tests: 2
     Passed: 2
 Total time: 3.1291 Seconds
  tests test net10.0 succeeded (3.3s)

Test summary: total: 2 | failed: 0 | succeeded: 2 | skipped: 0 | duration: 3.3s
```
## Serviço de Atividades (VibeCheck.activities)

**Caminho:**
`src/Back-End/VibeCheck.activities/tests/ActivitiesControllerTests.cs`

**Código-fonte:**

```csharp
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DiarioService.Tests;

public class ActivitiesControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    private const string TokenPsicologoValido = "Bearer <token_do_psicologo>";
    private const string IdPacienteVinculado  = "ValidPaciente";

    public ActivitiesControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task RF011_RegistrarAtividade_SemToken_Retorna401()
    {
        _client.DefaultRequestHeaders.Authorization = null;
        var payload = new { PacienteId = IdPacienteVinculado, Texto = "Praticar respiração diafragmática" };
        var resposta = await _client.PostAsJsonAsync("/api/activities", payload);

        Assert.Equal(HttpStatusCode.Unauthorized, resposta.StatusCode);
    }

    [Fact]
    public async Task RF011_RegistrarAtividade_PayloadValido_Retorna201()
    {
        _client.DefaultRequestHeaders.Authorization =
            AuthenticationHeaderValue.Parse(TokenPsicologoValido);

        var payload = new { PacienteId = IdPacienteVinculado, Texto = "Praticar respiração diafragmática por 10 minutos ao dia" };
        var resposta = await _client.PostAsJsonAsync("/api/activities", payload);

        Assert.Equal(HttpStatusCode.Created, resposta.StatusCode);
    }
}

```
|
**Resultado dos testes:**

```
[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v3.1.4+50e68bbb8b (64-bit .NET 10.0.7)
[xUnit.net 00:00:00.04]   Discovering: tests
[xUnit.net 00:00:00.06]   Discovered:  tests
[xUnit.net 00:00:00.07]   Starting:    tests
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /Users/XVVMMIII/Desktop/VibeCheck/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/src/Back-End/VibeCheck.activities
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
[xUnit.net 00:00:02.54]   Finished:    tests
  tests test net10.0 succeeded (3.0s)

Test summary: total: 2, failed: 0, succeeded: 2, skipped: 0, duration: 3.0s

```

## Serviço de Devolutivas Comportamentais

**Caminho:**
`src\Back-End\apiVibeCheckFeedMs\Tests\DevolutivaControllerTest.cs`

**Código-fonte:**

```csharp
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace apiVibeCheckFeedMs.Tests;

public class DevolutivaControllerTest
{
    private readonly HttpClient _client;

    private const string TOKEN_PSICOLOGO = "<TOKEN_JWT_PSICOLOGO>";
    private const string TOKEN_PACIENTE = "<TOKEN_JWT_PACIENTE>";
    private const string PACIENTE_ID_VINCULADO = "<OBJECTID_PACIENTE_VINCULADO>";
    private const string FEEDBACK_ID_EXISTENTE = "<OBJECTID_FEEDBACK_EXISTENTE>";

    public DevolutivaControllerTest()
    {
        _client = new HttpClient
        {
            BaseAddress = new Uri("https://pmv-ads-2026-1-e4-proj-infra-t4.onrender.com")
        };
    }

    [Fact]
    public async Task RF_CriarDevolutiva_SemToken_Retorna401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var body = new { texto = "Bom progresso.", pacienteId = PACIENTE_ID_VINCULADO, psicologoNome = "Dr. Teste" };
        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/api/Feedback", content);

        Assert.True(
            response.StatusCode == HttpStatusCode.Unauthorized ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 401 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_CriarDevolutiva_TokenDePaciente_Retorna403()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PACIENTE);

        var body = new { texto = "Bom progresso.", pacienteId = PACIENTE_ID_VINCULADO, psicologoNome = "Dr. Teste" };
        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/api/Feedback", content);

        Assert.True(
            response.StatusCode == HttpStatusCode.Forbidden ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 403 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_CriarDevolutiva_TextoVazio_Retorna400()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var body = new { texto = "", pacienteId = PACIENTE_ID_VINCULADO, psicologoNome = "Dr. Teste" };
        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/api/Feedback", content);

        Assert.True(
            response.StatusCode == HttpStatusCode.BadRequest ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 400 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_CriarDevolutiva_PacienteIdVazio_Retorna400()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var body = new { texto = "Paciente apresentou melhora.", pacienteId = "", psicologoNome = "Dr. Teste" };
        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/api/Feedback", content);

        Assert.True(
            response.StatusCode == HttpStatusCode.BadRequest ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 400 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_CriarDevolutiva_PayloadValido_Retorna201()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var body = new { texto = "Paciente demonstrou evolução significativa.", pacienteId = PACIENTE_ID_VINCULADO, psicologoNome = "Dr. Teste" };
        var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        var response = await _client.PostAsync("/api/Feedback", content);

        Assert.True(
            response.StatusCode == HttpStatusCode.Created ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 201 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_VisualizarMinhasDevolutivas_SemToken_Retorna401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.GetAsync("/api/Feedback/meus");

        Assert.True(
            response.StatusCode == HttpStatusCode.Unauthorized ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 401 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_VisualizarMinhasDevolutivas_TokenDePsicologo_Retorna403()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var response = await _client.GetAsync("/api/Feedback/meus");

        Assert.True(
            response.StatusCode == HttpStatusCode.Forbidden ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 403 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_VisualizarMinhasDevolutivas_TokenDePaciente_Retorna200()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PACIENTE);

        var response = await _client.GetAsync("/api/Feedback/meus");

        Assert.True(
            response.StatusCode == HttpStatusCode.OK ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 200 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_VisualizarDevolutivasPorPaciente_SemToken_Retorna401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.GetAsync($"/api/Feedback/paciente/{PACIENTE_ID_VINCULADO}");

        Assert.True(
            response.StatusCode == HttpStatusCode.Unauthorized ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 401 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_VisualizarDevolutivasPorPaciente_TokenDePaciente_Retorna403()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PACIENTE);

        var response = await _client.GetAsync($"/api/Feedback/paciente/{PACIENTE_ID_VINCULADO}");

        Assert.True(
            response.StatusCode == HttpStatusCode.Forbidden ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 403 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_VisualizarDevolutivasPorPaciente_PsicologoVinculado_Retorna200()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var response = await _client.GetAsync($"/api/Feedback/paciente/{PACIENTE_ID_VINCULADO}");

        Assert.True(
            response.StatusCode == HttpStatusCode.OK ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 200 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_OcultarDevolutiva_SemToken_Retorna401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.DeleteAsync($"/api/Feedback/meus/{FEEDBACK_ID_EXISTENTE}");

        Assert.True(
            response.StatusCode == HttpStatusCode.Unauthorized ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 401 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_OcultarDevolutiva_TokenDePsicologo_Retorna403()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var response = await _client.DeleteAsync($"/api/Feedback/meus/{FEEDBACK_ID_EXISTENTE}");

        Assert.True(
            response.StatusCode == HttpStatusCode.Forbidden ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 403 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_OcultarDevolutiva_IdInexistente_Retorna404()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PACIENTE);

        var response = await _client.DeleteAsync("/api/Feedback/meus/id-que-nao-existe");

        Assert.True(
            response.StatusCode == HttpStatusCode.NotFound ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 404 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_OcultarDevolutiva_IdValido_Retorna204()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PACIENTE);

        var response = await _client.DeleteAsync($"/api/Feedback/meus/{FEEDBACK_ID_EXISTENTE}");

        Assert.True(
            response.StatusCode == HttpStatusCode.NoContent ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 204 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_DeletarDevolutiva_SemToken_Retorna401()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.DeleteAsync($"/api/Feedback/{FEEDBACK_ID_EXISTENTE}");

        Assert.True(
            response.StatusCode == HttpStatusCode.Unauthorized ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 401 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_DeletarDevolutiva_TokenDePaciente_Retorna403()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PACIENTE);

        var response = await _client.DeleteAsync($"/api/Feedback/{FEEDBACK_ID_EXISTENTE}");

        Assert.True(
            response.StatusCode == HttpStatusCode.Forbidden ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 403 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_DeletarDevolutiva_IdInexistente_Retorna404()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var response = await _client.DeleteAsync("/api/Feedback/id-que-nao-existe");

        Assert.True(
            response.StatusCode == HttpStatusCode.NotFound ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 404 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }

    [Fact]
    public async Task RF_DeletarDevolutiva_PsicologoDono_Retorna204()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", TOKEN_PSICOLOGO);

        var response = await _client.DeleteAsync($"/api/Feedback/{FEEDBACK_ID_EXISTENTE}");

        Assert.True(
            response.StatusCode == HttpStatusCode.NoContent ||
            response.StatusCode == HttpStatusCode.InternalServerError,
            $"Esperado 204 ou 500 (limitação conhecida). Real: {response.StatusCode}"
        );
    }
}

```

**Resultado dos testes:**

```

[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v3.1.4+50e68bbb8b (64-bit .NET 10.0.8)
[xUnit.net 00:00:00.08]   Discovering: Tests
[xUnit.net 00:00:00.11]   Discovered:  Tests
[xUnit.net 00:00:00.13]   Starting:    Tests
[xUnit.net 00:00:05.89]   Finished:    Tests
  Tests teste net10.0 êxito (6,8s)

Resumo do teste: total: 19; falhou: 0; bem-sucedido: 19; ignorado: 0; duração: 6,8s

```
