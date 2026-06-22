using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace VibeCheck_v1.Models
{
    public class Feedback
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("entradaId")]
        public string? EntradaId { get; set; } 

        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("psicologoId")]
        public string? PsicologoId { get; set; }

        [BsonElement("conteudo")]
        public string? Conteudo { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
    }
}