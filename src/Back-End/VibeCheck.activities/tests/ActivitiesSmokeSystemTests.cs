using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Atividades.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Atividades.Tests
{
    public class ActivitiesControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        
        private const string PsicologoId = "69d532a679273df9d88a0843";
        private const string PacienteId = "69f28361685ca4de958e00d8";

        public ActivitiesControllerTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
            
            _client.DefaultRequestHeaders.Add("X-Psicologo-Id", PsicologoId);
        }

        // ─── Helpers ────────────────────────────────────────────────────────────

        private StringContent Json(object body) =>
            new(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        private async Task<Activity> CriarAtividade(string texto = "Atividade de teste")
        {
            var body = new
            {
                pacienteId = PacienteId,
                psicologoId = PsicologoId,
                texto,
                dataEntrega = DateTime.UtcNow.AddDays(7).ToString("o"),
                status = 0,
                estaConcluida = false,
                createdAt = DateTime.UtcNow.ToString("o"),
                updatedAt = DateTime.UtcNow.ToString("o")
            };

            var response = await _client.PostAsync("/api/activities", Json(body));
            response.EnsureSuccessStatusCode();

            var created = await response.Content.ReadFromJsonAsync<Activity>(_jsonOptions);
            return created!;
        }

        // ─── GET /api/activities ─────────────────────────────────────────────────

        [Fact]
        public async Task GET_Activities_DeveRetornar200()
        {
            var response = await _client.GetAsync("/api/activities");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GET_Activities_DeveRetornarListaDeAtividades()
        {
            await CriarAtividade("Atividade para listar");

            var response = await _client.GetAsync("/api/activities");
            var atividades = await response.Content.ReadFromJsonAsync<List<Activity>>(_jsonOptions);

            Assert.NotNull(atividades);
            Assert.True(atividades.Count > 0);
        }

        // ─── GET /api/activities/{id} ────────────────────────────────────────────

        [Fact]
        public async Task GET_ActivityById_DeveRetornar200_QuandoExiste()
        {
            var criada = await CriarAtividade();
            var response = await _client.GetAsync($"/api/activities/{criada.Id}");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GET_ActivityById_DeveRetornar404_QuandoNaoExiste()
        {
            var response = await _client.GetAsync("/api/activities/000000000000000000000000");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GET_ActivityById_DeveRetornarAtividadeCorreta()
        {
            var criada = await CriarAtividade("Atividade específica");
            var response = await _client.GetAsync($"/api/activities/{criada.Id}");
            var atividade = await response.Content.ReadFromJsonAsync<Activity>(_jsonOptions);

            Assert.NotNull(atividade);
            Assert.Equal("Atividade específica", atividade.Texto);
            Assert.Equal(PacienteId, atividade.PacienteId);
        }

        // ─── GET /api/activities/paciente/{pacienteId} ───────────────────────────

        [Fact]
        public async Task GET_ActivitiesByPaciente_DeveRetornar200()
        {
            var response = await _client.GetAsync($"/api/activities/paciente/{PacienteId}");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GET_ActivitiesByPaciente_DeveRetornarSomenteAtividadesDoPaciente()
        {
            await CriarAtividade("Atividade do paciente");

            var response = await _client.GetAsync($"/api/activities/paciente/{PacienteId}");
            var atividades = await response.Content.ReadFromJsonAsync<List<Activity>>(_jsonOptions);

            Assert.NotNull(atividades);
            Assert.All(atividades, a => Assert.Equal(PacienteId, a.PacienteId));
        }

        // ─── POST /api/activities ────────────────────────────────────────────────

        [Fact]
        public async Task POST_Activity_DeveRetornar201_QuandoDadosValidos()
        {
            var body = new
            {
                pacienteId = PacienteId,
                texto = "Nova atividade",
                status = 0,
                estaConcluida = false,
                createdAt = DateTime.UtcNow.ToString("o"),
                updatedAt = DateTime.UtcNow.ToString("o")
            };

            var response = await _client.PostAsync("/api/activities", Json(body));

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        [Fact]
        public async Task POST_Activity_DeveSalvarPsicologoIdDoHeader()
        {
            var criada = await CriarAtividade();
            var response = await _client.GetAsync($"/api/activities/{criada.Id}");
            var atividade = await response.Content.ReadFromJsonAsync<Activity>(_jsonOptions);

            Assert.Equal(PsicologoId, atividade!.PsicologoId);
        }

        [Fact]
        public async Task POST_Activity_DeveRetornarAtividadeCriada()
        {
            var criada = await CriarAtividade("Verificar retorno");

            Assert.NotNull(criada.Id);
            Assert.Equal("Verificar retorno", criada.Texto);
            Assert.Equal(PacienteId, criada.PacienteId);
            Assert.Equal(ActivityStatus.Pendente, criada.Status);
        }

        // ─── PUT /api/activities/{id} ────────────────────────────────────────────

        [Fact]
        public async Task PUT_Activity_DeveRetornar204_QuandoAtualizada()
        {
            var criada = await CriarAtividade();

            var atualizada = new
            {
                pacienteId = PacienteId,
                psicologoId = PsicologoId,
                texto = criada.Texto,
                status = 1,
                estaConcluida = true,
                createdAt = criada.CreatedAt.ToString("o"),
                updatedAt = DateTime.UtcNow.ToString("o")
            };

            var response = await _client.PutAsync($"/api/activities/{criada.Id}", Json(atualizada));

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        [Fact]
        public async Task PUT_Activity_DeveAtualizarStatus()
        {
            var criada = await CriarAtividade();

            var atualizada = new
            {
                pacienteId = PacienteId,
                psicologoId = PsicologoId,
                texto = criada.Texto,
                status = 1,
                estaConcluida = true,
                createdAt = criada.CreatedAt.ToString("o"),
                updatedAt = DateTime.UtcNow.ToString("o")
            };

            await _client.PutAsync($"/api/activities/{criada.Id}", Json(atualizada));

            var response = await _client.GetAsync($"/api/activities/{criada.Id}");
            var resultado = await response.Content.ReadFromJsonAsync<Activity>(_jsonOptions);

            Assert.Equal(ActivityStatus.Concluida, resultado!.Status);
            Assert.True(resultado.EstaConcluida);
        }

        [Fact]
        public async Task PUT_Activity_DeveRetornar404_QuandoNaoExiste()
        {
            var body = new
            {
                pacienteId = PacienteId,
                texto = "Inexistente",
                status = 1,
                estaConcluida = true,
                createdAt = DateTime.UtcNow.ToString("o"),
                updatedAt = DateTime.UtcNow.ToString("o")
            };

            var response = await _client.PutAsync("/api/activities/000000000000000000000000", Json(body));

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ─── DELETE /api/activities/{id} ─────────────────────────────────────────

        [Fact]
        public async Task DELETE_Activity_DeveRetornar204_QuandoExiste()
        {
            var criada = await CriarAtividade();
            var response = await _client.DeleteAsync($"/api/activities/{criada.Id}");

            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        [Fact]
        public async Task DELETE_Activity_DeveRemoverAtividade()
        {
            var criada = await CriarAtividade();
            await _client.DeleteAsync($"/api/activities/{criada.Id}");

            var response = await _client.GetAsync($"/api/activities/{criada.Id}");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DELETE_Activity_DeveRetornar404_QuandoNaoExiste()
        {
            var response = await _client.DeleteAsync("/api/activities/000000000000000000000000");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ─── Health check ─────────────────────────────────────────────────────────

        [Fact]
        public async Task GET_Health_DeveRetornar200()
        {
            var response = await _client.GetAsync("/health");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}