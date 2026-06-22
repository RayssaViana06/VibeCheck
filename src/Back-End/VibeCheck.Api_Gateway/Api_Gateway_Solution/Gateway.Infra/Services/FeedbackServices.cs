using Gateway.Domain.Interfaces;
using Gateway.Domain.Requests;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Net.Http.Json;

namespace Gateway.Application.Services
{
    public class FeedbackServices(IHttpClientFactory httpClientFactory) : IFeedbackServices
    {
        public async Task<object> CreateAsync(FeedbackRequest request, string authHeader)
        {
            try
            {
                return await ExecutePost<FeedbackRequest, object>(request, "FeedbackService", "api/Feedback", authHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao criar devolutiva: " + ex.Message); }
        }

        public async Task<object> GetByPacienteAsync(string pacienteId, string authHeader)
        {
            try
            {
                return await ExecuteGet<object>("FeedbackService", $"api/Feedback/paciente/{pacienteId}", authHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao buscar devolutivas: " + ex.Message); }
        }

        public async Task DeleteAsync(string id, string authHeader)
        {
            try
            {
                await ExecuteDelete("FeedbackService", $"api/Feedback/{id}", authHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao excluir devolutiva: " + ex.Message); }
        }

        public async Task<object> GetMeusAsync(string authHeader)
        {
            try
            {
                return await ExecuteGet<object>("FeedbackService", "api/Feedback/meus", authHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao buscar devolutivas: " + ex.Message); }
        }

        public async Task OcultarAsync(string id, string authHeader)
        {
            try
            {
                await ExecuteDelete("FeedbackService", $"api/Feedback/meus/{id}", authHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao ocultar devolutiva: " + ex.Message); }
        }

        private async Task<TResponse> ExecutePost<TRequest, TResponse>(
            TRequest request, string clientName, string endpoint, string? authHeader = null)
        {
            var client = httpClientFactory.CreateClient(clientName);
            var message = new HttpRequestMessage(HttpMethod.Post, endpoint)
            {
                Content = new StringContent(JsonSerializer.Serialize(request), System.Text.Encoding.UTF8, "application/json")
            };
            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);
            var response = await client.SendAsync(message);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<TResponse>()
                ?? throw new ApplicationException("Resposta inválida do feedback-service.");
        }

        private async Task<TResponse> ExecuteGet<TResponse>(
            string clientName, string endpoint, string? authHeader = null)
        {
            var client = httpClientFactory.CreateClient(clientName);
            var message = new HttpRequestMessage(HttpMethod.Get, endpoint);
            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);
            var response = await client.SendAsync(message);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<TResponse>()
                ?? throw new ApplicationException("Resposta inválida do feedback-service.");
        }

        private async Task ExecuteDelete(string clientName, string endpoint, string? authHeader = null)
        {
            var client = httpClientFactory.CreateClient(clientName);
            var message = new HttpRequestMessage(HttpMethod.Delete, endpoint);
            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);
            var response = await client.SendAsync(message);
            response.EnsureSuccessStatusCode();
        }
    }
}