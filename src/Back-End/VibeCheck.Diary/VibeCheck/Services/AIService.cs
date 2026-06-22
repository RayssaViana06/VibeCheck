using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using VibeCheck_v1.Models;

namespace VibeCheck_v1.Services
{
    public interface IAIService
    {
        Task<List<FraseAnalisada>?> AnalisarEntradaAsync(string idEntrada, string idPaciente, string texto);
    }

    public class AIService : IAIService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _endpoint;
        private readonly ILogger<AIService> _log;

        public AIService(HttpClient http, IConfiguration config, ILogger<AIService> log)
        {
            _http = http;
            _log = log;
            _endpoint = config["AISettings:Endpoint"] ?? string.Empty;
            _apiKey = config["AISettings:ApiKey"] ?? string.Empty;
        }

        public async Task<List<FraseAnalisada>?> AnalisarEntradaAsync(string idEntrada, string idPaciente, string texto)
        {
            if (string.IsNullOrWhiteSpace(_endpoint) || string.IsNullOrWhiteSpace(_apiKey))
            {
                _log.LogWarning("Endpoint ou chave da IA não configurados.");
                return null;
            }

            var payload = new
            {
                id_entrada = idEntrada,
                id_paciente = idPaciente,
                texto = texto
            };

            using var req = new HttpRequestMessage(HttpMethod.Post, _endpoint)
            {
                Content = JsonContent.Create(payload)
            };
            req.Headers.Add("X-API-Key", _apiKey);

            var resp = await _http.SendAsync(req);
            var body = await resp.Content.ReadAsStringAsync();

            if (!resp.IsSuccessStatusCode)
            {
                _log.LogWarning("IA retornou erro {Status}: {Body}", (int)resp.StatusCode, body);
                return null;
            }

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                using var doc = JsonDocument.Parse(body);

                foreach (var prop in doc.RootElement.EnumerateObject())
                {
                    if (string.Equals(prop.Name, "frases", StringComparison.OrdinalIgnoreCase)
                        && prop.Value.ValueKind == JsonValueKind.Array)
                    {
                        return JsonSerializer.Deserialize<List<FraseAnalisada>>(prop.Value.GetRawText(), options);
                    }
                }

                _log.LogWarning("Resposta da IA não contém campo 'frases'. Body: {Body}", body);
                return null;
            }
            catch (JsonException ex)
            {
                _log.LogError(ex, "Erro ao desserializar resposta da IA. Body: {Body}", body);
                return null;
            }
        }
    }
}