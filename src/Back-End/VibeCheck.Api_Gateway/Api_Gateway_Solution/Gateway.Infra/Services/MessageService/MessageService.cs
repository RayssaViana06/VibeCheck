using Gateway.Domain.Requests.MessageService;
using Gateway.Domain.Response;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Net.Http.Json;
using System.Security.Cryptography.X509Certificates;
using Gateway.Domain.Interfaces;
using System.Net;

namespace Gateway.Infra.Services.MessageService
{
    public class MessageService(IHttpClientFactory factory) : IMessageService
    {
        public async Task<CriarChatResponse> CriarChat(CriarChatRequest chat, string token) 
        {
            return await ExecutePost<CriarChatRequest, CriarChatResponse>(chat, "MessageClient", "/chats/criar-chat", token)
                   ?? throw new InvalidOperationException("Falha ao criar chat.");
        }

        public async Task<BuscarChatResponse> BuscarChat(string userId, string token) 
        {
            var endpoint = $"/chats/buscar-chats/{userId}";
                
            return await ExecuteGet<BuscarChatResponse>("MessageClient", endpoint, token) 
                   ?? throw new InvalidOperationException("Falha ao buscar chat.");
        }

        public void DeletarChat(Guid chatId, string token) 
        {
            try
            {
                var endpoint = $"/chats/deletar-chat/{chatId}";
                ExecuteDelete("MessageClient", endpoint, token);
            }
            catch (Exception ex) 
            {
                throw new ApplicationException($"Erro ao excluir chat {chatId}: {ex}");
            }
        }

        #region Private Methods
        private readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        private async Task<TResponse?> ExecuteGet<TResponse>(string clientName, string endpoint, string? authHeader = null)
        {
            var client = factory.CreateClient(clientName);

            var message = new HttpRequestMessage(HttpMethod.Get, endpoint);
            

            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);

            var response = await client.SendAsync(message);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadFromJsonAsync<TResponse>(_jsonOptions);
        }

        private async Task<TResponse?> ExecutePost<TRequest, TResponse>(
           TRequest request, string clientName, string endpoint, string? authHeader = null)
        {
            
            var client = factory.CreateClient(clientName);

            var message = new HttpRequestMessage(HttpMethod.Post, endpoint)
            {
                Content = new StringContent(JsonSerializer.Serialize(request, _jsonOptions), System.Text.Encoding.UTF8, "application/json")
            };

            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);



            var response = await client.SendAsync(message);
            response.EnsureSuccessStatusCode();

            var resposne = await response.Content.ReadFromJsonAsync<TResponse>(_jsonOptions);
            return resposne;
        }

        private async void ExecuteDelete(string clientName, string endpoint, string? authHeader = null)
        {
            var client = factory.CreateClient(clientName);

            var message = new HttpRequestMessage(HttpMethod.Delete, endpoint);

            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);

            var response = await client.SendAsync(message);
            response.EnsureSuccessStatusCode();
        }
        #endregion
    }
}
