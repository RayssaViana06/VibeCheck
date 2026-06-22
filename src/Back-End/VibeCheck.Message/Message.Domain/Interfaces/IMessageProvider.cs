using Message.Domain.Models;

namespace Message.Domain.Interfaces
{
    public interface IMessageProvider
    {
        Task ReceiveMessage (Mensagem mensagem);
    }
}
