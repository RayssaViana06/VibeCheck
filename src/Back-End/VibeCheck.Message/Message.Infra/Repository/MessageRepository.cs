using Message.Domain.Constants;
using Message.Domain.Interfaces;
using Message.Domain.Models;
using Message.Infra.Documents;
using Message.Infra.Mappers;
using MongoDB.Driver;

namespace Message.Infra.Services
{
    public class MessageRepository : IMessageRepository
    {
        private readonly IMongoCollection<MensagemDocument> _messageCollection;
        public MessageRepository(IMongoClient mongoClient)
        {
            _messageCollection = mongoClient
                .GetDatabase(DbConstants.BANCO_MESSAGE)
                .GetCollection<MensagemDocument>(DbConstants.COLLECTION_MESSAGES);
        }

        public async Task SaveMessage(Mensagem message)
        {
            await _messageCollection.InsertOneAsync(message.MapToDocument());
        }


        public async Task<IQueryable<Mensagem>> GetMessages(string id)
        {
            var filter = Builders<MensagemDocument>.Filter.Eq(c => c.ChatId, id);
            var mensagens = await _messageCollection.Find(filter).ToListAsync();
            return mensagens.Select(m => m.MapToDomain()).AsQueryable();
        }
    }
}
