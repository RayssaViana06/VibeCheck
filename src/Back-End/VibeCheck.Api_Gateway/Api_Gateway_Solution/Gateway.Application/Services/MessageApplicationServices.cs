using Gateway.Domain.Interfaces;
using Gateway.Domain.Requests.MessageService;
using Gateway.Domain.Response;

namespace Gateway.Application.Services
{
    public class MessageApplicationServices(IMessageService messageService) : IMessageAppServices
    {
        private readonly IMessageService _messageService = messageService;

        public async Task<CriarChatResponse> CriarChat(CriarChatRequest chat, string token)
            => await _messageService.CriarChat(chat, token);

        public async Task<BuscarChatResponse> BuscarChat(string userId, string token)
            => await _messageService.BuscarChat(userId, token);

        public void DeletarChat(Guid chatId, string token)
            => _messageService.DeletarChat(chatId, token);

    }
}
