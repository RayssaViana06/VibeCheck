using Message.Application.Commands;
using Message.Application.Handlers;
using Message.Domain.Interfaces;
using Moq;

namespace Message.TestUnit.Handlers
{
    public class DeletarChatHandlerTest
    {
        [Fact]
        public async Task Handle_DeveDeletarChat_QuandoRepositorioExecutarComSucesso()
        {
            var request = new DeletarChatCommand { ChatId = "chat-1" };
            var chatRepositoryMock = new Mock<IChatRepository>();
            chatRepositoryMock
                .Setup(r => r.DeleteChatASync(request.ChatId))
                .Returns(Task.CompletedTask);

            var handler = new DeletarChatHandler(chatRepositoryMock.Object);

            await handler.Handle(request, CancellationToken.None);

            chatRepositoryMock.Verify(r => r.DeleteChatASync(request.ChatId), Times.Once);
        }

        [Fact]
        public async Task Handle_DeveLancarArgumentNullException_QuandoRequestForNulo()
        {
            var chatRepositoryMock = new Mock<IChatRepository>();
            var handler = new DeletarChatHandler(chatRepositoryMock.Object);

            await Assert.ThrowsAsync<ArgumentNullException>(() => handler.Handle(null!, CancellationToken.None));
            chatRepositoryMock.Verify(r => r.DeleteChatASync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task Handle_DeveLancarApplicationException_QuandoRepositorioFalhar()
        {
            var request = new DeletarChatCommand { ChatId = "chat-erro" };
            var excecaoInterna = new Exception("falha no repositorio");

            var chatRepositoryMock = new Mock<IChatRepository>();
            chatRepositoryMock
                .Setup(r => r.DeleteChatASync(request.ChatId))
                .ThrowsAsync(excecaoInterna);

            var handler = new DeletarChatHandler(chatRepositoryMock.Object);

            var ex = await Assert.ThrowsAsync<ApplicationException>(() => handler.Handle(request, CancellationToken.None));

            Assert.Equal($"Erro ao deletar chat: {request.ChatId}.", ex.Message);
            Assert.Equal(excecaoInterna, ex.InnerException);
            chatRepositoryMock.Verify(r => r.DeleteChatASync(request.ChatId), Times.Once);
        }
    }
}
