using System.Net.Http.Json;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Message.TestIntegration.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Message.TestIntegration.Controllers
{
    public class MensagensEndpointsTest
    {
        [Fact]
        public async Task BuscarMensagens_DeveRetornarMensagensDoChat()
        {
            using var factory = new MessageApiFactory();
            using var client = factory.CreateClient();

            var repository = factory.Services.GetRequiredService<IMessageRepository>() as InMemoryMessageRepository
                ?? throw new InvalidOperationException("Repositorio de mensagens nao encontrado.");

            var chatId = "chat-1";
            repository.SeedMessage(new Mensagem(chatId, "Oi", "usuario-1"));

            var response = await client.GetAsync($"/chats/buscar-mensagens/{chatId}");

            response.EnsureSuccessStatusCode();

            var body = await response.Content.ReadFromJsonAsync<BuscarMensagensResponseDto>();

            Assert.NotNull(body);
            Assert.Single(body.mensagens);
        }

        private class BuscarMensagensResponseDto
        {
            public List<MensagemDto> mensagens { get; set; } = new();
        }

        private class MensagemDto
        {
            public string? Id { get; set; }
            public string? ChatId { get; set; }
            public string? Texto { get; set; }
            public string? UsuarioOrigem { get; set; }
            public DateTime CreateAt { get; set; }
        }
    }
}
