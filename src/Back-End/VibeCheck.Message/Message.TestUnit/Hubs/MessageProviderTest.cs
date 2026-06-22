using Message.Api.Hubs;
using Message.Application.DTOs;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace Message.TestUnit.Hubs
{
    public class MessageProviderTest
    {
        [Fact]
        public async Task SendMessage_DeveSalvarMensagemENotificarUsuarioDestino()
        {
            var request = new SendMessageRequest
            {
                ChatId = "chat-1",
                Texto = "ola",
                UsuarioDestinoId = "destino-1"
            };

            var messageRepositoryMock = new Mock<IMessageRepository>();
            var clientsMock = new Mock<IHubCallerClients<IMessageProvider>>();
            var clientMock = new Mock<IMessageProvider>();
            var contextMock = new Mock<HubCallerContext>();

            contextMock.Setup(c => c.UserIdentifier).Returns("origem-1");
            clientsMock.Setup(c => c.User(request.UsuarioDestinoId)).Returns(clientMock.Object);

            var hub = new MessageProvider(messageRepositoryMock.Object)
            {
                Context = contextMock.Object,
                Clients = clientsMock.Object
            };

            await hub.SendMessage(request);

            messageRepositoryMock.Verify(r => r.SaveMessage(It.Is<Mensagem>(m =>
                m.ChatId == request.ChatId &&
                m.Texto == request.Texto &&
                m.UsuarioOrigem == "origem-1")), Times.Once);

            clientMock.Verify(c => c.ReceiveMessage(It.Is<Mensagem>(m =>
                m.ChatId == request.ChatId &&
                m.Texto == request.Texto &&
                m.UsuarioOrigem == "origem-1")), Times.Once);

            clientsMock.Verify(c => c.User(request.UsuarioDestinoId), Times.Once);
        }
    }
}
