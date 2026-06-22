using MongoDB.Bson.Serialization.Attributes;

namespace VibeCheck_v1.Models
{
    public class DiaryEntry
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("pacienteId")]
        public string? PacienteId { get; set; }

        [BsonElement("texto")]
        public string? Texto { get; set; }

        [BsonElement("analiseIA")]
        public AnaliseIA? AnaliseIA { get; set; }

        [BsonElement("lida")]
        public bool Lida { get; set; } = false;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}