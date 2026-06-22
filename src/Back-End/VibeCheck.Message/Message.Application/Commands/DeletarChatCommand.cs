using MediatR;

namespace Message.Application.Commands
{
    public class DeletarChatCommand : IRequest
    {
        public string ChatId { get; set; }
    }
}
