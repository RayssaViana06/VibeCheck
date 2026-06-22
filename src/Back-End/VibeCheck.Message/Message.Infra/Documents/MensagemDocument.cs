using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Message.Infra.Documents
{
    public class MensagemDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Id { get; set; }

        public string ChatId { get; set; }
        public string Texto { get; set; }
        public string UsuarioOrigem { get; set; }
        public DateTime CreateAt { get; set; }
    }
}