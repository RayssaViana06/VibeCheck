using MediatR;

namespace Message.Application.Commands
{
    public class BuscarMensagensCommand(string id): IRequest<BuscarMensagensResponse>
    {
        public string ChatId { get; set; } = id;
    }
}
