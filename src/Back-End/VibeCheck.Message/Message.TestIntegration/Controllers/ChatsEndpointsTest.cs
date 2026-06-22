using System.Net.Http.Json;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Message.TestIntegration.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Message.TestIntegration.Controllers
{
    public class ChatsEndpointsTest
    {
        [Fact]
        public async Task CriarChat_DeveRetornarOkEChat()
        {
            using var factory = new MessageApiFactory();
            using var client = factory.CreateClient();

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

        [Fact]
        public async Task BuscarChats_DeveRetornarChatsDoUsuario()
        {
            using var factory = new MessageApiFactory();
            using var client = factory.CreateClient();

            var repository = factory.Services.GetRequiredService<IChatRepository>() as InMemoryChatRepository
                ?? throw new InvalidOperationException("Repositorio de chat nao encontrado.");

            var chat = new Chat("paciente-1", "Paciente 1", "psicologo-1", "Psicologo 1");
            repository.SeedChat(chat);

            var response = await client.GetAsync("/chats/buscar-chats/paciente-1");

            response.EnsureSuccessStatusCode();

            var body = await response.Content.ReadFromJsonAsync<BuscarChatsResponseDto>();

            Assert.NotNull(body);
            Assert.Single(body.Chats);
            Assert.Equal(chat.Id, body.Chats[0].Id);
        }

        [Fact]
        public async Task DeletarChat_DeveRemoverChat()
        {
            using var factory = new MessageApiFactory();
            using var client = factory.CreateClient();

            var repository = factory.Services.GetRequiredService<IChatRepository>() as InMemoryChatRepository
                ?? throw new InvalidOperationException("Repositorio de chat nao encontrado.");

            var chat = new Chat("paciente-1", "Paciente 1", "psicologo-1", "Psicologo 1");
            repository.SeedChat(chat);

            var response = await client.DeleteAsync($"/chats/deletar-chat/{chat.Id}");

            response.EnsureSuccessStatusCode();
            Assert.False(repository.Exists(chat.Id));
        }

        private class CriarChatResponseDto
        {
            public ChatDto? ChatResponse { get; set; }
        }

        private class BuscarChatsResponseDto
        {
            public List<ChatDto> Chats { get; set; } = new();
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
