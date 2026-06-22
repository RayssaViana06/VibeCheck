using System.Text.Json.Serialization;

namespace VibeCheck_v1.Models
{
    public class FraseAnalisada
    {
        [JsonPropertyName("frase")]
        public string Frase { get; set; } = string.Empty;

        [JsonPropertyName("emocao_dominante")]
        public string EmocaoDominante { get; set; } = string.Empty;

        [JsonPropertyName("intensidade")]
        public double Intensidade { get; set; }

        [JsonPropertyName("todas_emocoes")]
        public TodasEmocoes TodasEmocoes { get; set; } = new();
    }
}