using MongoDB.Bson.Serialization.Attributes;

namespace VibeCheck_v1.Models
{
    public class FraseParaBanco
    {
        [BsonElement("trecho")]
        public string Trecho { get; set; } = string.Empty;

        [BsonElement("emocao")]
        public string Emocao { get; set; } = string.Empty;

        [BsonElement("intensidade")]
        public int Intensidade { get; set; }
    }
}