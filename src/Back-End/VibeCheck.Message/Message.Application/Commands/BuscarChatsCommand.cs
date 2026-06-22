using MediatR;

namespace Message.Application.Commands
{
    public class BuscarChatsCommand(string chatId) : IRequest<BuscarChatsResponse>
    {
        public string ChatId { get; set; } = chatId;
    }
}
            