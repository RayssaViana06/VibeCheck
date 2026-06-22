using Message.Application.Commands;
using Message.Application.Handlers;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Moq;

namespace Message.TestUnit.Handlers
{
    public class BuscarChatHandlerTest
    {
        [Fact]
        public async Task Handle_DeveRetornarChats_QuandoRepositorioRetornarDados()
        {
            var chatId = "usuario-123";
            var chatsEsperados = new List<Chat>
            {
                new("chat-1", "paciente-1", "Paciente 1", "psicologo-1", "Psicologo 1", DateTime.UtcNow)
            };

            var chatRepositoryMock = new Mock<IChatRepository>();
            chatRepositoryMock
                .Setup(r => r.GetChatsAsync(chatId))
                .ReturnsAsync(chatsEsperados);

            var handler = new BuscarChatsHandler(chatRepositoryMock.Object);
            var command = new BuscarChatsCommand(chatId);

            var response = await handler.Handle(command, CancellationToken.None);

            Assert.NotNull(response);
            Assert.Equal(chatsEsperados, response.Chats);
            chatRepositoryMock.Verify(r => r.GetChatsAsync(chatId), Times.Once);
        }

        [Fact]
        public async Task Handle_DeveLancarExcecao_QuandoRepositorioFalhar()
        {
            var chatId = "usuario-123";
            var chatRepositoryMock = new Mock<IChatRepository>();
            chatRepositoryMock
                .Setup(r => r.GetChatsAsync(chatId))
                .ThrowsAsync(new Exception("falha ao buscar chats"));

            var handler = new BuscarChatsHandler(chatRepositoryMock.Object);
            var command = new BuscarChatsCommand(chatId);

            await Assert.ThrowsAsync<Exception>(() => handler.Handle(command, CancellationToken.None));
            chatRepositoryMock.Verify(r => r.GetChatsAsync(chatId), Times.Once);
        }
    }
}
