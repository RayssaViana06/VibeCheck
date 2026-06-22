using System.Net.Http.Headers;
using System.Text.Json;
using VibeCheck.Interfaces;

namespace VibeCheck.Services
{
    public class CriarChatService : ICriarChat
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public CriarChatService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task CriarChat(string psicologoId, string nomePsicologo, string pacienteId, string nomePaciente, string token)
        {
            var client = _httpClientFactory.CreateClient("ChatService");

            var requestData = new
            {
                PacienteId = pacienteId,
                PsicologoId = psicologoId,
                NomePaciente = nomePaciente,
                NomePsicologo = nomePsicologo
            };

            var messageRequest = new HttpRequestMessage(HttpMethod.Post, "/chats/criar-chat")
            {
                Content = new StringContent(JsonSerializer.Serialize(requestData), System.Text.Encoding.UTF8, "application/json")
            };

            if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = token.Substring(7).Trim();
            }

            messageRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await client.SendAsync(messageRequest);

            Console.WriteLine($"Chat creation response: {response.StatusCode}");
            Console.WriteLine($"Response content: {await response.Content.ReadAsStringAsync()}");

        }
    }
}
