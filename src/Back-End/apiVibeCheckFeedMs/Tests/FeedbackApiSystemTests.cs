using System.Net;
using System.Net.Http.Json;
using apiVibeCheckFeedMs.Domain.Dtos;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace apiVibeCheckFeedMs.Tests;

public class FeedbackApiSystemTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public FeedbackApiSystemTests(WebApplicationFactory<Program> factory)
    {
        Environment.SetEnvironmentVariable(
            "JWT_SECRET_KEY", "chave-de-teste-com-mais-de-32-caracteres-123456");
        _factory = factory;
    }

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

    [Fact]
    public async Task GET_MeusFeedbacks_SemToken_DeveRetornar401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/feedback/meus");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
