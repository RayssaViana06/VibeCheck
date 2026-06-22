using Message.Domain.Interfaces;
using Message.Domain.Models;

namespace Message.TestIntegration.Infrastructure
{
    public class InMemoryChatRepository : IChatRepository
    {
        private readonly List<Chat> _chats = new();
        private readonly object _lock = new();

        public Task<Chat> CreateChatAsync(Chat chat)
        {
            lock (_lock)
            {
                _chats.Add(chat);
                return Task.FromResult(chat);
            }
        }

        public Task<List<Chat>> GetChatsAsync(string userId)
        {
            lock (_lock)
            {
                var result = _chats
                    .Where(chat => chat.PacienteId == userId || chat.PsicologoId == userId)
                    .ToList();

                return Task.FromResult(result);
            }
        }

        public Task DeleteChatASync(string chatId)
        {
            lock (_lock)
            {
                _chats.RemoveAll(chat => chat.Id == chatId);
                return Task.CompletedTask;
            }
        }

        public void SeedChat(Chat chat)
        {
            lock (_lock)
            {
                _chats.Add(chat);
            }
        }

        public bool Exists(string chatId)
        {
            lock (_lock)
            {
                return _chats.Any(chat => chat.Id == chatId);
            }
        }
    }
}
