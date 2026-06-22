using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Message.TestIntegration.Infrastructure;

namespace Message.TestIntegration.Controllers
{
    public class MessageAuthSystemTests
    {
        [Fact]
        public async Task BuscarChats_SemToken_DeveRetornar401()
        {
            using var factory = new MessageApiSystemFactory();
            using var client = factory.CreateClient();

            var response = await client.GetAsync("/chats/buscar-chats/paciente-1");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task BuscarMensagens_SemToken_DeveRetornar401()
        {
            using var factory = new MessageApiSystemFactory();
            using var client = factory.CreateClient();

            var response = await client.GetAsync("/chats/buscar-mensagens/chat-1");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

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

        private class CriarChatResponseDto
        {
            public ChatDto? ChatResponse { get; set; }
        }

        private class ChatDto
        {
            public string? Id { get; set; }
            public string? PacienteId { get; set; }
            public string? NomePaciente { get; set; }
            public string? PsicologoId { get; set; }
            public string? NomePsicologo { get; set; }
        }
    }
}
