using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace auth_service.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("passwordHash")]
        public string PasswordHash { get; set; } = null!;

        [BsonElement("role")]
        public string Role { get; set; } = null!;

        [BsonElement("cpf")]
        public string? Cpf { get; set; }

        [BsonElement("crp")]
        public string? Crp { get; set; }

        [BsonElement("dataNascimento")]
        public DateTime? DataNascimento { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}