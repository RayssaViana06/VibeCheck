using Message.Application.DTOs;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Message.Api.Hubs
{
    [Authorize]
    public class MessageProvider(IMessageRepository repo) : Hub<IMessageProvider>
    {
        private readonly IMessageRepository _messageRepository = repo;

        public async Task SendMessage(SendMessageRequest request)
        {

            var usuarioOrigemId = Context.UserIdentifier!;

            var mensagem = new Mensagem(
               chatId: request.ChatId,
               texto: request.Texto,
               usuarioOrigem: usuarioOrigemId
           );

            await _messageRepository.SaveMessage(mensagem);

            await Clients.User(request.UsuarioDestinoId).ReceiveMessage(mensagem);
        }
    }
}
