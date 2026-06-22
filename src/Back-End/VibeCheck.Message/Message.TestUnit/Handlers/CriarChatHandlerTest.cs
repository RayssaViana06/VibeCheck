using Message.Application.Commands;
using Message.Application.Handlers;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Moq;

namespace Message.TestUnit.Handlers
{
    public class CriarChatHandlerTest
    {
        [Fact]
        public async Task Handle_DeveRetornarChatCriado_QuandoRepositorioExecutarComSucesso()
        {
            var request = new CriarChatCommand
            {
                PacienteId = "paciente-1",
                PsicologoId = "psicologo-1",
                NomePaciente = "Paciente 1",
                NomePsicologo = "Psicologo 1"
            };

            var chatCriado = new Chat("chat-1", request.PacienteId, request.NomePaciente, request.PsicologoId, request.NomePsicologo, DateTime.UtcNow);
            var chatRepositoryMock = new Mock<IChatRepository>();
            chatRepositoryMock
                .Setup(r => r.CreateChatAsync(It.IsAny<Chat>()))
                .ReturnsAsync(chatCriado);

            var handler = new CriarChatsHandler(chatRepositoryMock.Object);

            var response = await handler.Handle(request, CancellationToken.None);

            Assert.NotNull(response);
            Assert.Equal(chatCriado, response.ChatResponse);
            chatRepositoryMock.Verify(r => r.CreateChatAsync(It.Is<Chat>(c =>
                c.PacienteId == request.PacienteId &&
                c.PsicologoId == request.PsicologoId)), Times.Once);
        }

        [Fact]
        public async Task Handle_DeveLancarArgumentNullException_QuandoRequestForNulo()
        {
            var chatRepositoryMock = new Mock<IChatRepository>();
            var handler = new CriarChatsHandler(chatRepositoryMock.Object);

            await Assert.ThrowsAsync<ArgumentNullException>(() => handler.Handle(null!, CancellationToken.None));
            chatRepositoryMock.Verify(r => r.CreateChatAsync(It.IsAny<Chat>()), Times.Never);
        }

        [Fact]
        public async Task Handle_DeveLancarExceptionComMensagemPadrao_QuandoRepositorioFalhar()
        {
            var request = new CriarChatCommand
            {
                PacienteId = "paciente-1",
                PsicologoId = "psicologo-1",
                NomePaciente = "Paciente 1",
                NomePsicologo = "Psicologo 1"
            };

            var chatRepositoryMock = new Mock<IChatRepository>();
            chatRepositoryMock
                .Setup(r => r.CreateChatAsync(It.IsAny<Chat>()))
                .ThrowsAsync(new Exception("falha no repositorio"));

            var handler = new CriarChatsHandler(chatRepositoryMock.Object);

            var ex = await Assert.ThrowsAsync<Exception>(() => handler.Handle(request, CancellationToken.None));

            Assert.Equal("Erro ao criar chat: falha no repositorio", ex.Message);
            chatRepositoryMock.Verify(r => r.CreateChatAsync(It.IsAny<Chat>()), Times.Once);
        }
    }
}
