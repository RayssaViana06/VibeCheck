using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace auth_service.Models
{
    public class TokenBlacklist
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("token")]
        public string Token { get; set; } = null!;

        [BsonElement("expiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}