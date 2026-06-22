using MongoDB.Bson.Serialization.Attributes;

namespace VibeCheck_v1.Models
{
    public class AnaliseIA
    {
        [BsonElement("emocaoPredominante")]
        public string EmocaoPredominante { get; set; } = string.Empty;

        [BsonElement("frases")]
        public List<FraseParaBanco> Frases { get; set; } = new();
    }
}