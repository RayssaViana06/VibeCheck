using Gateway.Domain.Interfaces;
using Gateway.Domain.Models.PsiDiaryService;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Gateway.Application.Services
{
    public class PsiDiaryServices : IPsiDiaryServices
    {
        private readonly HttpClient _client;

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public PsiDiaryServices(IHttpClientFactory httpClientFactory)
        {
            _client = httpClientFactory.CreateClient("DiarioClient");
        }

        public async Task<IEnumerable<PsiDiaryModel>> GetAllAsync(string authHeader)
        {
            SetAuth(authHeader);
            var response = await _client.GetAsync("/api/Diario");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<PsiDiaryModel>>(json, _jsonOptions)
                   ?? Enumerable.Empty<PsiDiaryModel>();
        }

        public async Task<IEnumerable<PsiDiaryModel>> FilterByHumorAsync(string humor, string authHeader)
        {
            SetAuth(authHeader);
            var response = await _client.GetAsync($"/api/Diario/filtro/humor?humor={humor}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<PsiDiaryModel>>(json, _jsonOptions)
                   ?? Enumerable.Empty<PsiDiaryModel>();
        }

        public async Task<IEnumerable<PsiDiaryModel>> FilterByPacienteAsync(string pacienteId, string authHeader)
        {
            SetAuth(authHeader);
            var response = await _client.GetAsync($"/api/Diary/historico/{pacienteId}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<PsiDiaryModel>>(json, _jsonOptions)
                   ?? Enumerable.Empty<PsiDiaryModel>();
        }

        public async Task<IEnumerable<PsiDiaryModel>> FilterByPeriodoAsync(DateTime dataInicio, DateTime dataFim, string authHeader)
        {
            SetAuth(authHeader);
            var url = $"/api/Diario/filtro/periodo?dataInicio={dataInicio:yyyy-MM-dd}&dataFim={dataFim:yyyy-MM-dd}";
            var response = await _client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<IEnumerable<PsiDiaryModel>>(json, _jsonOptions)
                   ?? Enumerable.Empty<PsiDiaryModel>();
        }

        private void SetAuth(string authHeader)
        {
            var token = authHeader.Replace("Bearer ", "").Trim();
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }
    }
}