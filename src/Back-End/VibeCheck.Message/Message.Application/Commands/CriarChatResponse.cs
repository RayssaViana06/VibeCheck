using Message.Domain.Models;

namespace Message.Application.Commands
{
    public class CriarChatResponse
    {
        public Chat ChatResponse { get; set; }

        public CriarChatResponse(Chat dados)
        {
            ChatResponse = dados;
        }
    }
}