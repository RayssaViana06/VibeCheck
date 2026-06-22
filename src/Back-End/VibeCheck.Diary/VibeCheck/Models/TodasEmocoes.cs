using System.Text.Json.Serialization;

namespace VibeCheck_v1.Models
{
    public class TodasEmocoes
    {
        [JsonPropertyName("anger")]
        public double Anger { get; set; }

        [JsonPropertyName("disgust")]
        public double Disgust { get; set; }

        [JsonPropertyName("fear")]
        public double Fear { get; set; }

        [JsonPropertyName("joy")]
        public double Joy { get; set; }

        [JsonPropertyName("neutral")]
        public double Neutral { get; set; }

        [JsonPropertyName("sadness")]
        public double Sadness { get; set; }

        [JsonPropertyName("surprise")]
        public double Surprise { get; set; }
    }
}