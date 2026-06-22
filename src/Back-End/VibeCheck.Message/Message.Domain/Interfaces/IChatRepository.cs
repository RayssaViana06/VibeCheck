using Message.Domain.Models;

namespace Message.Domain.Interfaces
{
    public interface IChatRepository
    {
        Task<Chat> CreateChatAsync(Chat chat);
        Task<List<Chat>> GetChatsAsync(string userId);
        Task DeleteChatASync( string chatId);


    }
}
