using Message.Domain.Constants;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Message.Infra.Documents;
using Message.Infra.Mappers;
using MongoDB.Driver;

namespace Message.Infra.Services
{
    public class ChatRepository: IChatRepository
    {
        private readonly IMongoCollection<ChatDocument> _chatCollection;
        public ChatRepository(IMongoClient mongoClient)
        {
            _chatCollection = mongoClient
                .GetDatabase(DbConstants.BANCO_MESSAGE)
                .GetCollection<ChatDocument>(DbConstants.COLLECTION_CHATS);
        }
        public async Task<Chat> CreateChatAsync(Chat chat)
        {
            if(chat == null)
                throw new ArgumentNullException(nameof(chat));

            var document = chat.MapToDocument();
            await _chatCollection.InsertOneAsync(document);
            return chat;
        }

        public async Task DeleteChatASync(string chatId)
        {
            if (chatId == null)
                throw new ArgumentNullException(nameof(chatId));

            var filter = Builders<ChatDocument>.Filter.Eq(c => c.Id, chatId);

            await _chatCollection.DeleteOneAsync(filter);
        }

        public async Task<List<Chat>> GetChatsAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
                throw new ArgumentNullException(nameof(userId));

            var filter = Builders<ChatDocument>.Filter.Or(
                Builders<ChatDocument>.Filter.Eq(c => c.PacienteId, userId),
                Builders<ChatDocument>.Filter.Eq(c => c.PsicologoId, userId));      

            var documents = await _chatCollection.Find(filter).ToListAsync();
            return documents.Select(x => x.MapToDomain()).ToList();
        }
    }
}
