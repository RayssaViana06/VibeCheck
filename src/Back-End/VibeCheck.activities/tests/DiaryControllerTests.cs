using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace DiarioService.Tests;

public class DiaryControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    private const string ValidPsychologistToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY5ZDUzMmE2NzkyNzNkZjlkODhhMDg0MyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJEcmEuIEFuYSBMaW1hIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoibWFyaWFAZW1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoicHNpY29sb2dvIiwiZXhwIjoxNzc5MzI2ODg3LCJpc3MiOiJhdXRoLXNlcnZpY2UiLCJhdWQiOiJ2aWJlY2hlY2stYXBwIn0.kkgEjTWii-KqjAE78WFf5TOk2IsmDjt5pvUewsxchPU";
    private const string ValidPatientToken      = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY5ZDdkYTY2Zjk1ZDI3YWQyMjFlOWJjNiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJQYXVsbyBTaWx2YSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImpvYW9AZW1haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoicGFjaWVudGUiLCJleHAiOjE5MzcwODgwMDAsImlzcyI6ImF1dGgtc2VydmljZSIsImF1ZCI6InZpYmVjaGVjay1hcHAifQ.AALzcp3DT_NGq_JUiVQD9gw2fyK7D9oAIAhNdh4FPPQ";

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
