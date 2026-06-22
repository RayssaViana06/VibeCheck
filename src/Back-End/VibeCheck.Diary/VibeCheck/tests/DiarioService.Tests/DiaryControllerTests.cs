using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using VibeCheck_v1.Models;
using VibeCheck_v1.Repositories;
using VibeCheck_v1.Services;
using Xunit;

namespace DiarioService.Tests
{
    public class DiaryControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly Mock<DiaryRepository> _repoMock;
        private readonly Mock<IAIService> _aiMock;

        // token de teste gerado com a mesma chave do appsettings
        private const string TokenValido = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InBhY2llbnRlLXRlc3RlLWlkIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidGVzdGVAZW1haWwuY29tIiwiZXhwIjoyNTM0MDIzMDA4MDB9.placeholder";

        public DiaryControllerTests(WebApplicationFactory<Program> factory)
        {
            _repoMock = new Mock<DiaryRepository>();
            _aiMock = new Mock<IAIService>();

            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddSingleton(_repoMock.Object);
                    services.AddSingleton(_aiMock.Object);
                });
            });
        }

        private HttpClient CriarClienteAutenticado()
        {
            var client = _factory.CreateClient();
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", TokenValido);
            return client;
        }

        //  POST sem token deve retornar 401
        [Fact]
        public async Task test_criar_entrada_sem_token()
        {
            var client = _factory.CreateClient();
            var body = new { texto = "Hoje me senti bem." };

            var response = await client.PostAsJsonAsync("/api/diary", body);

            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        //  POST com texto válido deve retornar 201
        [Fact]
        public async Task test_criar_entrada_valida()
        {
            var client = CriarClienteAutenticado();
            var body = new { texto = "Hoje me senti bem." };

            _repoMock.Setup(r => r.CreateEntryAsync(It.IsAny<DiaryEntry>()))
                     .Returns(Task.CompletedTask);

            var response = await client.PostAsJsonAsync("/api/diary", body);

            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        //  pacienteId deve vir do token, não do body
        [Fact]
        public async Task test_paciente_id_do_token()
        {
            var client = CriarClienteAutenticado();
            var body = new { texto = "Teste.", pacienteId = "id-falso-do-body" };

            DiaryEntry? entradaSalva = null;
            _repoMock.Setup(r => r.CreateEntryAsync(It.IsAny<DiaryEntry>()))
                     .Callback<DiaryEntry>(e => entradaSalva = e)
                     .Returns(Task.CompletedTask);

            await client.PostAsJsonAsync("/api/diary", body);

            entradaSalva?.PacienteId.Should().NotBe("id-falso-do-body");
        }

        //  GET sem token deve retornar 401
        [Fact]
        public async Task test_historico_sem_token()
        {
            var client = _factory.CreateClient();

            var response = await client.GetAsync("/api/diary/historico");

            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        //  GET deve retornar apenas entradas do paciente autenticado
        [Fact]
        public async Task test_historico_retorna_entradas_do_paciente()
        {
            var client = CriarClienteAutenticado();

            _repoMock.Setup(r => r.GetHistoryByPatientAsync(It.IsAny<string>()))
                     .ReturnsAsync(new List<DiaryEntry>
                     {
                         new DiaryEntry { PacienteId = "paciente-teste-id", Texto = "Entrada 1" },
                         new DiaryEntry { PacienteId = "paciente-teste-id", Texto = "Entrada 2" }
                     });

            var response = await client.GetAsync("/api/diary/historico");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var body = await response.Content.ReadAsStringAsync();
            body.Should().Contain("paciente-teste-id");
        }

        //  GET deve retornar lista vazia se paciente não tiver entradas
        [Fact]
        public async Task test_historico_vazio()
        {
            var client = CriarClienteAutenticado();

            _repoMock.Setup(r => r.GetHistoryByPatientAsync(It.IsAny<string>()))
                     .ReturnsAsync(new List<DiaryEntry>());

            var response = await client.GetAsync("/api/diary/historico");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var body = await response.Content.ReadAsStringAsync();
            body.Should().Be("[]");
        }

        //  entrada deve ser salva mesmo se IA falhar
        [Fact]
        public async Task test_entrada_salva_mesmo_com_falha_ia()
        {
            var client = CriarClienteAutenticado();
            var body = new { texto = "Hoje foi um dia difícil." };

            _repoMock.Setup(r => r.CreateEntryAsync(It.IsAny<DiaryEntry>()))
                     .Returns(Task.CompletedTask);

            _aiMock.Setup(a => a.AnalisarEntradaAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                   .ReturnsAsync((List<FraseAnalisada>?)null);

            var response = await client.PostAsJsonAsync("/api/diary", body);

            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }
    }
}