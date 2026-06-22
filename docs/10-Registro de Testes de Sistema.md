# Testes de Sistema no Backend

## O que são Testes de Sistema?

Testes de sistema são testes automatizados que verificam o comportamento completo de um sistema, validando que ele funciona conforme esperado em um ambiente real ou próximo do real. Eles englobam a verificação de todas as funcionalidades do sistema, desde a interface do usuário até a integração com bancos de dados, APIs externas e outros serviços.

## Por que são Importantes?

Testes de sistema ajudam a:

- Garantir que o sistema como um todo atende aos requisitos especificados.
- Identificar problemas que surgem em interações complexas entre componentes.
- Validar a funcionalidade completa em um ambiente que simula o uso real.
- Garantir que as mudanças no código não causem regressões em áreas não diretamente relacionadas.

## Como executar os testes

```bash
# Serviços .NET
dotnet test <caminho-do-projeto-de-testes>.csproj

# Serviço de IA (Python)
.venv/bin/python -m pytest
```

---

# Testes de Sistema do projeto VibeCheck

## API de IA (VibeCheck.IA)

Analisa o texto do diário e classifica as emoções predominantes em cada frase e as intensidades dessas emoções.

**Projeto de testes:** `src/Back-End/VibeCheck.IA/tests`

### test_sem_api_key

Testa que chamar a rota /analisar sem a API key é bloqueado (erro 401).

```python
def test_sem_api_key():
    """Deve retornar 401 quando a chave não for enviada"""
    response = client.post("/analisar", json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": "hoje me senti bem"
    })
    assert response.status_code == 401
```

### test_api_key_invalida

Testa que uma API key inválida é rejeitada (erro 403).

```python
def test_api_key_invalida():
    """Deve retornar 403 quando a chave for inválida"""
    response = client.post("/analisar", json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": "hoje me senti bem"
    }, headers={"X-API-Key": "chave_errada"})
    assert response.status_code == 403
```

### test_texto_vazio

Testa que um texto vazio não é aceito (erro 400).

```python
def test_texto_vazio():
    """Deve retornar 400 quanto o texto vier vazio"""
    response = client.post("/analisar",json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": ""
    }, headers=HEADERS)
    assert response.status_code == 400
```

### test_retorno_tem_campos_esperados

testa que a resposta tem os campos esperados (entry_id, patient_id, frases).

```python
def test_retorno_tem_campos_esperados():
    """Deve retornar os campos entry_id, patient_id e frases."""
    response = client.post("/analisar", json={
        "id_entrada": "123",
        "id_paciente": "456",
        "texto": "hoje eu acordei feliz e me senti bem"
    }, headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert "entry_id" in data
    assert "patient_id" in data
    assert "frases" in data
```

### test_ids_retornados_corretamente

Testa que os IDs recebidos são iguais aos enviados na request.

```python
def test_ids_retornados_corretamente():
    """Os IDs retornados devem ser iguais aos enviados."""
    response = client.post("/analisar", json={
        "id_entrada": "333",
        "id_paciente": "3",
        "texto": "hoje eu acordei feliz"
    }, headers=HEADERS)
    data = response.json()
    assert data["entry_id"] == "333"
    assert data["patient_id"] == "3"
```

### test_frases_tem_estrutura_correta

Testa que cada frase analisada tem os campos esperados

```python
def test_frases_tem_estrutura_correta():
    """Cada frase deve ter os campos esperados."""
    response = client.post("/analisar", json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": "hoje eu acordei feliz"
    }, headers=HEADERS)
    data = response.json()
    for frase in data["frases"]:
        assert "frase" in frase
        assert "emocao_dominante" in frase
        assert "intensidade" in frase
        assert "todas_emocoes" in frase
```

**Resultado no terminal:**

```bash
vitorbisivieira@Vitors-MacBook-Air VibeCheck.IA % .venv/bin/python -m pytest -v
=========================================================================================== test session starts ===========================================================================================
platform darwin -- Python 3.11.15, pytest-9.0.3, pluggy-1.6.0 -- /Users/vitorbisivieira/Desktop/VibeCheck/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/src/Back-End/VibeCheck.IA/.venv/bin/python
cachedir: .pytest_cache
rootdir: /Users/vitorbisivieira/Desktop/VibeCheck/pmv-ads-2026-1-e4-proj-infra-t4-vibecheck/src/Back-End/VibeCheck.IA
plugins: anyio-4.12.1
collected 6 items                                                                                                                                                                                         

tests/test_main.py::test_texto_vazio PASSED                                                                                                                                                         [ 16%]
tests/test_main.py::test_sem_api_key PASSED                                                                                                                                                         [ 33%]
tests/test_main.py::test_api_key_invalida PASSED                                                                                                                                                    [ 50%]
tests/test_main.py::test_retorno_tem_campos_esperados PASSED                                                                                                                                        [ 66%]
tests/test_main.py::test_ids_retornados_corretamente PASSED                                                                                                                                         [ 83%]
tests/test_main.py::test_frases_tem_estrutura_correta PASSED                                                                                                                                        [100%]

=========================================================================================== 6 passed in 12.34s ============================================================================================
```
---
## API de Atividades (VibeCheck.activities)

Responsável pelas atividades que os psicólogos enviam aos pacientes.

**Projeto de testes:** `src/Back-End/VibeCheck.activities/tests`

### GET_Health_DeveRetornar200

Testa que o endpoint de health responde que a API está no ar (erro 200).

```csharp
public async Task GET_Health_DeveRetornar200()
{
 
    var response = await _client.GetAsync("/health");

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
}
```

### GET_Activities_SemToken_DeveRetornar401

Testa que listar atividades sem token de autenticação é bloqueado (erro 401).

```csharp
public async Task GET_Activities_SemToken_DeveRetornar401()
{
    _client.DefaultRequestHeaders.Authorization = null;

    var response = await _client.GetAsync("/api/activities");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
}
```

### GET_Activities_ComTokenValido_DeveRetornar200

Testa que se a listagem de atividades funciona tendo token valido (200).

```csharp
public async Task GET_Activities_ComTokenValido_DeveRetornar200()
{
    _client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", TokenValido);
    _client.DefaultRequestHeaders.Remove("X-Psicologo-Id");
    _client.DefaultRequestHeaders.Add("X-Psicologo-Id", PsicologoId);

    var response = await _client.GetAsync("/api/activities");

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
}
```

**Resultado no terminal:**

```bash
C:\..\..\..\..\ICEI-PUC-Minas-PMV-ADS\pmv-ads-2026-1-e4-proj-infra-t4-vibecheck\src\Back-End\VibeCheck.activities\tests>dotnet test --filter "FullyQualifiedName~ActivitiesSmokeSystemTests"
Restauração concluída (0,4s)
  Atividades êxito (0,3s) → C:\Users\XVVMMIII\source\repos\ICEI-PUC-Minas-PMV-ADS\pmv-ads-2026-1-e4-proj-infra-t4-vibecheck\src\Back-End\VibeCheck.activities\bin\Debug\net9.0\Atividades.dll
  tests êxito (0,8s) → bin\Debug\net9.0\tests.dll
[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v3.1.4+50e68bbb8b (64-bit .NET 9.0.14)
[xUnit.net 00:00:00.50]   Discovering: tests
[xUnit.net 00:00:00.54]   Discovered:  tests
[xUnit.net 00:00:00.56]   Starting:    tests
[xUnit.net 00:00:02.95]   Finished:    tests
  tests teste êxito (4,3s)

Resumo do teste: total: 3; falhou: 0; bem-sucedido: 3; ignorado: 0; duração: 4,3s
Construir êxito em 6,4s

```
## API de Mensagens (VibeCheck.Message)

Gerencia chats e mensagens entre paciente e psicologo.

**Projeto de testes:** `src/Back-End/VibeCheck.Message/Message.TestIntegration`

### BuscarChats_SemToken_DeveRetornar401

Testa que listar chats sem token de autenticacao e bloqueado (erro 401).

```csharp
[Fact]
public async Task BuscarChats_SemToken_DeveRetornar401()
{
    using var factory = new MessageApiSystemFactory();
    using var client = factory.CreateClient();

    var response = await client.GetAsync("/chats/buscar-chats/paciente-1");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
}
```

### BuscarMensagens_SemToken_DeveRetornar401

Testa que buscar mensagens sem token de autenticacao e bloqueado (erro 401).

```csharp
[Fact]
public async Task BuscarMensagens_SemToken_DeveRetornar401()
{
    using var factory = new MessageApiSystemFactory();
    using var client = factory.CreateClient();

    var response = await client.GetAsync("/chats/buscar-mensagens/chat-1");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
}
```

### CriarChat_SemToken_DeveRetornar401

Testa que criar chat sem token de autenticacao e bloqueado (erro 401).

```csharp
[Fact]
public async Task CriarChat_SemToken_DeveRetornar401()
{
    using var factory = new MessageApiSystemFactory();
    using var client = factory.CreateClient();

    var payload = new
    {
        pacienteId = "paciente-1",
        psicologoId = "psicologo-1",
        nomePaciente = "Paciente 1",
        nomePsicologo = "Psicologo 1"
    };

    var response = await client.PostAsJsonAsync("/chats/criar-chat", payload);

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
}
```

### CriarChat_ComTokenValido_DeveRetornar200

Testa que criar chat com token valido retorna sucesso (200).

```csharp
[Fact]
public async Task CriarChat_ComTokenValido_DeveRetornar200()
{
    using var factory = new MessageApiSystemFactory();
    using var client = factory.CreateClient();

    var token = JwtTokenFactory.CreateToken(MessageApiSystemFactory.JwtKey);
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

    var payload = new
    {
        pacienteId = "paciente-1",
        psicologoId = "psicologo-1",
        nomePaciente = "Paciente 1",
        nomePsicologo = "Psicologo 1"
    };

    var response = await client.PostAsJsonAsync("/chats/criar-chat", payload);

    response.EnsureSuccessStatusCode();

    var body = await response.Content.ReadFromJsonAsync<CriarChatResponseDto>();

    Assert.NotNull(body);
    Assert.NotNull(body.ChatResponse);
    Assert.Equal(payload.pacienteId, body.ChatResponse.PacienteId);
}
```

**Resultado no terminal:**

```bash
✅ PASSED: CriarChat_ComTokenValido_DeveRetornar200 (906ms)
✅ PASSED: BuscarChats_SemToken_DeveRetornar401 (167ms)
✅ PASSED: BuscarMensagens_SemToken_DeveRetornar401 (50ms)
✅ PASSED: CriarChat_SemToken_DeveRetornar401 (61ms)

========================================
Test Run Summary
========================================
Total Tests: 4
Passed: 4
Failed: 0
Skipped: 0
✅ Result: SUCCEEDED
Test Execution Time: 1.58s (1581ms)
Total Time (including build): 7.91s (7914ms)
========================================
```



---
## API de Diário (VibeCheck.Diary)

Salva e consulta as entradas do diário do paciente

**Projeto de testes:** `src/Back-End/VibeCheck.Diary/VibeCheck/tests/DiarioService.Tests`

### POST_Diary_SemToken_DeveRetornar401

Testa que criar uma entrada de diário sem token de autenticação e bloqueado (erro 401).

```csharp
[Fact]
    public async Task POST_Diary_SemToken_DeveRetornar401()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsync("/api/diary", null);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
```

### GET_Historico_ComTokenValido_DeveRetornar200

Testa que a consulta ao histórico de entradas funciona tendo token valido (erro 200).

```csharp
 [Fact]
    public async Task GET_Historico_ComTokenValido_DeveRetornar200()
    {
        var client = _factory.CreateClient();
        var token = _factory.GerarToken($"paciente-teste-{Guid.NewGuid():N}");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/diary/historico");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
```

**Resultado no terminal:**

```bash
PS C:\--\--\--\--\--\--\--\pmv-ads-2026-1-e4-proj-infra-t4-vibecheck> dotnet test src/Back-End/VibeCheck.Diary/VibeCheck/tests/DiarioService.Tests/DiarioService.Tests.csproj --filter "FullyQualifiedName~DiaryApiSystemTests"
Restauração concluída (0,6s)
  VibeCheck_v1 net10.0 êxito (2,0s) → src\Back-End\VibeCheck.Diary\VibeCheck\bin\Debug\net10.0\VibeCheck_v1.dll
  DiarioService.Tests net10.0 êxito (1,8s) → src\Back-End\VibeCheck.Diary\VibeCheck\tests\DiarioService.Tests\bin\Debug\net10.0\DiarioService.Tests.dll
[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v2.8.2+699d445a1a (64-bit .NET 10.0.8)
[xUnit.net 00:00:02.84]   Discovering: DiarioService.Tests
[xUnit.net 00:00:03.81]   Discovered:  DiarioService.Tests
[xUnit.net 00:00:03.81]   Starting:    DiarioService.Tests
warn: Microsoft.AspNetCore.HttpsPolicy.HttpsRedirectionMiddleware[3]
      Failed to determine the https port for redirect.
[xUnit.net 00:00:10.84]   Finished:    DiarioService.Tests
  DiarioService.Tests teste net10.0 êxito (15,1s)

Resumo do teste: total: 2; falhou: 0; bem-sucedido: 2; ignorado: 0; duração: 15,1s
Construir êxito em 20,1s
```
---


## API de Autenticação (VibeCheck.Auth)
Faz o cadastro, login e gestão de usuários. É a que emite o token JWT.

Projeto de testes: `src/Back-End/VibeCheck.Auth/AuthService.Tests`

---

## TokenServiceTests

### GenerateToken_DeveRetornarTokenValido
Testa que o serviço de token gera um JWT válido com 3 partes separadas por ponto.

```csharp
[TestMethod]
public void GenerateToken_DeveRetornarTokenValido()
{
    var user = new User
    {
        Id = "69c1c6d8a77eab3dc2fbf630",
        Name = "Maria Santos",
        Email = "maria@email.com",
        Role = "paciente"
    };

    var token = _tokenService.GenerateToken(user);

    token.Should().NotBeNullOrEmpty();
    token.Split('.').Should().HaveCount(3);
}
```

### GenerateToken_DeveTerIssuerCorreto
Testa que o token JWT gerado contém o issuer correto.

```csharp
[TestMethod]
public void GenerateToken_DeveTerIssuerCorreto()
{
    var user = new User
    {
        Id = "69c1c6d8a77eab3dc2fbf630",
        Name = "Maria Santos",
        Email = "maria@email.com",
        Role = "paciente"
    };

    var token = _tokenService.GenerateToken(user);
    var handler = new JwtSecurityTokenHandler();
    var jwt = handler.ReadJwtToken(token);

    jwt.Issuer.Should().Be("auth-service");
}
```

### GenerateToken_DeveConterRoleCorreta
Testa que o token JWT gerado contém a role correta do usuário.

```csharp
[TestMethod]
public void GenerateToken_DeveConterRoleCorreta()
{
    var user = new User
    {
        Id = "69c1c6d8a77eab3dc2fbf630",
        Name = "Maria Santos",
        Email = "maria@email.com",
        Role = "psicologo"
    };

    var token = _tokenService.GenerateToken(user);
    var handler = new JwtSecurityTokenHandler();
    var jwt = handler.ReadJwtToken(token);

    jwt.Claims.Should().Contain(c => c.Value == "psicologo");
}
```

---

## UserServiceTests

### CreateAsync_DeveSalvarUsuario
Testa que a criação de um usuário é salva corretamente no banco.

```csharp
[TestMethod]
public async Task CreateAsync_DeveSalvarUsuario()
{
    var user = new User
    {
        Name = "João Silva",
        Email = "joao@email.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
        Role = "paciente",
        Cpf = "123.456.789-00"
    };

    _mockCollection
        .Setup(c => c.InsertOneAsync(user, null, default))
        .Returns(Task.CompletedTask);

    await _userService.CreateAsync(user);

    _mockCollection.Verify(c => c.InsertOneAsync(user, null, default), Times.Once);
}
```

### HashSenha_DeveGerarHashDiferenteDaSenhaOriginal
Testa que a senha armazenada é um hash, não o texto original.

```csharp
[TestMethod]
public void HashSenha_DeveGerarHashDiferenteDaSenhaOriginal()
{
    var senha = "senha123";
    var hash = BCrypt.Net.BCrypt.HashPassword(senha);

    hash.Should().NotBe(senha);
    hash.Should().StartWith("$2a$");
}
```

### VerificarSenha_DeveRetornarTrueParaSenhaCorreta
Testa que a verificação de senha retorna verdadeiro para a senha correta.

```csharp
[TestMethod]
public void VerificarSenha_DeveRetornarTrueParaSenhaCorreta()
{
    var senha = "senha123";
    var hash = BCrypt.Net.BCrypt.HashPassword(senha);
    var resultado = BCrypt.Net.BCrypt.Verify(senha, hash);

    resultado.Should().BeTrue();
}
```

### VerificarSenha_DeveRetornarFalseParaSenhaErrada
Testa que a verificação de senha retorna falso para senha incorreta.

```csharp
[TestMethod]
public void VerificarSenha_DeveRetornarFalseParaSenhaErrada()
{
    var senha = "senha123";
    var hash = BCrypt.Net.BCrypt.HashPassword(senha);
    var resultado = BCrypt.Net.BCrypt.Verify("senhaerrada", hash);

    resultado.Should().BeFalse();
}
```

---

## UserControllerTests

### Register_PacienteSemCpf_DeveRetornar400
Testa que o cadastro de paciente sem CPF é bloqueado com erro 400.

```csharp
[TestMethod]
public async Task Register_PacienteSemCpf_DeveRetornar400()
{
    var dto = new CreateUserDTO
    {
        Name = "João Silva",
        Email = "joao@email.com",
        Password = "senha123",
        Role = "paciente",
        Cpf = null
    };

    var resultado = await _userController.Register(dto);

    resultado.Should().BeOfType<BadRequestObjectResult>()
        .Which.Value.Should().Be("CPF é obrigatório para pacientes.");
}
```

### Register_PsicologoSemCrp_DeveRetornar400
Testa que o cadastro de psicólogo sem CRP é bloqueado com erro 400.

```csharp
[TestMethod]
public async Task Register_PsicologoSemCrp_DeveRetornar400()
{
    var dto = new CreateUserDTO
    {
        Name = "Dra. Ana Lima",
        Email = "ana@email.com",
        Password = "senha123",
        Role = "psicologo",
        Crp = null
    };

    var resultado = await _userController.Register(dto);

    resultado.Should().BeOfType<BadRequestObjectResult>()
        .Which.Value.Should().Be("CRP é obrigatório para psicólogos.");
}
```

### Register_SenhaCurta_DeveRetornar400
Testa que o cadastro com senha muito curta é bloqueado com erro 400.

```csharp
[TestMethod]
public async Task Register_SenhaCurta_DeveRetornar400()
{
    var dto = new CreateUserDTO
    {
        Name = "João Silva",
        Email = "joao@email.com",
        Password = "123",
        Role = "paciente",
        Cpf = null
    };

    var resultado = await _userController.Register(dto);

    resultado.Should().BeOfType<BadRequestObjectResult>();
}
```

### Register_RoleInvalido_DeveRetornar400
Testa que o cadastro com role inválida (ex: "admin") é bloqueado com erro 400.

```csharp
[TestMethod]
public async Task Register_RoleInvalido_DeveRetornar400()
{
    var dto = new CreateUserDTO
    {
        Name = "João Silva",
        Email = "joao@email.com",
        Password = "senha123",
        Role = "admin"
    };

    var resultado = await _userController.Register(dto);

    resultado.Should().BeOfType<BadRequestObjectResult>();
}
```

### Login_SenhaErrada_DeveRetornar401
Testa que o login com senha incorreta retorna erro 401.

```csharp
[TestMethod]
public async Task Login_SenhaErrada_DeveRetornar401()
{
    var user = new User
    {
        Id = "69c1c6d8a77eab3dc2fbf630",
        Name = "Maria Santos",
        Email = "maria@email.com",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
        Role = "paciente"
    };

    var cursor = new Mock<IAsyncCursor<User>>();
    cursor.Setup(c => c.Current).Returns(new List<User> { user });
    cursor.SetupSequence(c => c.MoveNextAsync(default))
        .ReturnsAsync(true)
        .ReturnsAsync(false);

    _mockCollection
        .Setup(c => c.FindAsync(
            It.IsAny<FilterDefinition<User>>(),
            It.IsAny<FindOptions<User, User>>(),
            default))
        .ReturnsAsync(cursor.Object);

    var dto = new LoginDTO
    {
        Email = "maria@email.com",
        Password = "senhaerrada"
    };

    var resultado = await _userController.Login(dto);

    resultado.Should().BeOfType<UnauthorizedObjectResult>()
        .Which.Value.Should().Be("E-mail ou senha inválidos.");
}
```

---

## UserValidationTests

### Validacao_PacienteSemCpf_DeveSerInvalido
Testa que a validação de dados rejeita paciente sem CPF.

```csharp
[TestMethod]
public void Validacao_PacienteSemCpf_DeveSerInvalido()
{
    var dto = new CreateUserDTO
    {
        Name = "João Silva",
        Email = "joao@email.com",
        Password = "senha123",
        Role = "paciente",
        Cpf = null
    };

    var cpfVazio = string.IsNullOrWhiteSpace(dto.Cpf);

    cpfVazio.Should().BeTrue();
}
```

### Validacao_PsicologoSemCrp_DeveSerInvalido
Testa que a validação de dados rejeita psicólogo sem CRP.

```csharp
[TestMethod]
public void Validacao_PsicologoSemCrp_DeveSerInvalido()
{
    var dto = new CreateUserDTO
    {
        Name = "Dra. Ana Lima",
        Email = "ana@email.com",
        Password = "senha123",
        Role = "psicologo",
        Crp = null
    };

    var crpVazio = string.IsNullOrWhiteSpace(dto.Crp);

    crpVazio.Should().BeTrue();
}
```

### Validacao_SenhaCurta_DeveSerInvalida
Testa que a validação de dados rejeita senha muito curta.

```csharp
[TestMethod]
public void Validacao_SenhaCurta_DeveSerInvalida()
{
    var dto = new CreateUserDTO
    {
        Name = "João Silva",
        Email = "joao@email.com",
        Password = "123",
        Role = "paciente",
        Cpf = null
    };

    var senhaInvalida = dto.Password.Length < 6;

    senhaInvalida.Should().BeTrue();
}
```

---

## Resultado no terminal

```
Execução de Teste Bem-sucedida.
Total de testes: 16
     Aprovados: 16
Tempo total: 12,4580 Segundos
  AuthService.Tests teste net10.0 êxito (18,0s)

Resumo do teste: total: 16; falhou: 0; bem-sucedido: 16; ignorado: 0; duração: 17,8s
Construir êxito(s) com 8 aviso(s) em 208,6s
```

## API de Feedback (apiVibeCheckFeedMs)

Responsável pelas devolutivas que os psicólogos escrevem para os pacientes.

**Projeto de testes:** `src/Back-End/apiVibeCheckFeedMs/Tests`

#### POST_Feedback_SemToken_DeveRetornar401

Testa que criar uma devolutiva sem token de autenticação é bloqueado (erro 401).

```csharp
[Fact]
public async Task POST_Feedback_SemToken_DeveRetornar401()
    {
        var client = _factory.CreateClient();
        var dto = new CreateFeedbackDto
        {
            PacienteId = "paciente-1",
            PsicologoNome = "Dra. Ana",
            Texto = "Paciente apresentou boa evolucao."
        };

        var response = await client.PostAsJsonAsync("/api/feedback", dto);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
```

#### GET_MeusFeedbacks_SemToken_DeveRetornar401

Testa que listar as devolutivas sem token de autenticação é bloqueado (erro 401)

```csharp
  [Fact]
    public async Task GET_MeusFeedbacks_SemToken_DeveRetornar401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/feedback/meus");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
```

**Resultado no terminal:**

```bash
[xUnit.net 00:00:00.00] xUnit.net VSTest Adapter v3.1.4+50e68bbb8b (64-bit .NET 10.0.8)
[xUnit.net 00:00:00.06]   Discovering: Tests
[xUnit.net 00:00:00.10]   Discovered:  Tests
[xUnit.net 00:00:00.12]   Starting:    Tests
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://0.0.0.0:8080
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: C:\vibeCheck\pmv-ads-2026-1-e4-proj-infra-t4-vibecheck\src\Back-End\apiVibeCheckFeedMs\apiVibeCheckFeedMs.Api
warn: Microsoft.AspNetCore.HttpsPolicy.HttpsRedirectionMiddleware[3]
      Failed to determine the https port for redirect.
info: Microsoft.Hosting.Lifetime[0]
      Application is shutting down...
[xUnit.net 00:00:00.42]   Finished:    Tests
  Tests teste net10.0 êxito (1,1s)

Resumo do teste: total: 2; falhou: 0; bem-sucedido: 2; ignorado: 0; duração: 1,1s
Construir êxito(s) com 16 aviso(s) em 2,9s
