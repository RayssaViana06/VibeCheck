using Message.Domain.Interfaces;
using Message.Domain.Models;

namespace Message.TestIntegration.Infrastructure
{
    public class InMemoryMessageRepository : IMessageRepository
    {
        private readonly List<Mensagem> _messages = new();
        private readonly object _lock = new();

        public Task SaveMessage(Mensagem message)
        {
            lock (_lock)
            {
                _messages.Add(message);
                return Task.CompletedTask;
            }
        }

        public Task<IQueryable<Mensagem>> GetMessages(string id)
        {
            lock (_lock)
            {
                var result = _messages
                    .Where(message => message.ChatId == id)
                    .AsQueryable();

                return Task.FromResult(result);
            }
        }

        public void SeedMessage(Mensagem message)
        {
            lock (_lock)
            {
                _messages.Add(message);
            }
        }
    }
}
