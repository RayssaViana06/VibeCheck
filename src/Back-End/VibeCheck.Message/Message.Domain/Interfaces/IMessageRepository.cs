using Message.Domain.Models;

namespace Message.Domain.Interfaces
{
    public interface IMessageRepository
    {
        Task SaveMessage(Mensagem message);
        Task<IQueryable<Mensagem>> GetMessages(string id);
    }
}
