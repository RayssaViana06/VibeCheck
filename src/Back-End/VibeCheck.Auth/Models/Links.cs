using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace auth_service.Models
{
    public class Link
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("pacienteId")]
        public string PacienteId { get; set; } = null!;
        [BsonElement("nomePaciente")]
        public string NomePaciente { get; set; } = string.Empty;

        [BsonElement("psicologoId")]
        public string PsicologoId { get; set; } = null!;
        [BsonElement("nomePsicologo")]
        public string NomePsicologo { get; set; } = string.Empty;

        [BsonElement("status")]
        public string Status { get; set; } = "ativo";

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}