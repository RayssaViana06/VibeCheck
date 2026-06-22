using Message.Domain.Models;

namespace Message.Application.Commands
{
    public class BuscarMensagensResponse(IEnumerable<Mensagem> dados)
    {
        public IEnumerable<Mensagem> mensagens { get; set; } = dados;
    }
}
