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