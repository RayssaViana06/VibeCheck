using Gateway.Domain.Interfaces;
using Gateway.Domain.Models.ActivityService;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Gateway.Application.Services
{
    public class ActivityServices : IActivityServices
    {
        private readonly HttpClient _client;

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public ActivityServices(IHttpClientFactory httpClientFactory)
        {
            _client = httpClientFactory.CreateClient("AtividadesClient");
        }

        
        public async Task<IEnumerable<ActivityModel>> GetAllAsync(string authHeader)
        {
            SetAuth(authHeader);
            var response = await _client.GetAsync("/api/activities");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<ActivityModel>>(json, _jsonOptions)
                   ?? Enumerable.Empty<ActivityModel>();
        }

        
        public async Task<ActivityModel> GetByIdAsync(string id, string authHeader)
        {
            SetAuth(authHeader);
            var response = await _client.GetAsync($"/api/activities/{id}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<ActivityModel>(json, _jsonOptions)!;
        }

        
        public async Task<ActivityModel> CreateAsync(object body, string authHeader)
        {
            SetAuth(authHeader);
            var content = Serialize(body);

            var response = await _client.PostAsync("/api/activities", content);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<ActivityModel>(json, _jsonOptions)!;
        }

        
        public async Task UpdateAsync(string id, object body, string authHeader)
        {
            SetAuth(authHeader);
            var content = Serialize(body);

            var response = await _client.PutAsync($"/api/activities/{id}", content);
            response.EnsureSuccessStatusCode();
        }

       
        public async Task DeleteAsync(string id, string authHeader)
        {
            SetAuth(authHeader);
            var response = await _client.DeleteAsync($"/api/activities/{id}");
            response.EnsureSuccessStatusCode();
        }

        
        private void SetAuth(string authHeader)
        {
            var token = authHeader.Replace("Bearer ", "").Trim();
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }

        private static StringContent Serialize(object body) =>
            new(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
    }
}