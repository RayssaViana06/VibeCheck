using Gateway.Domain.Requests.MessageService;
using Gateway.Domain.Response;

namespace Gateway.Domain.Interfaces
{
    public interface IMessageAppServices
    {
        Task<CriarChatResponse> CriarChat(CriarChatRequest chat, string token );

        Task<BuscarChatResponse> BuscarChat(string userId, string token);

        void DeletarChat(Guid chatId, string token);
    }
}
