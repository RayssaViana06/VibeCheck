using Gateway.Domain.Interfaces;
using System.Net.Http.Json;

namespace Gateway.Application.Services;

public class DiaryFilterServices(IHttpClientFactory httpClientFactory) : IDiaryFilterServices
{
    public async Task<object> FiltrarPorIntervaloAsync(string dataInicio, string dataFim, string authHeader)
    {
        try
        {
            return await ExecuteGet<object>("DiaryFilterService",
                $"api/diary/filter?dataInicio={dataInicio}&dataFim={dataFim}", authHeader);
        }
        catch (Exception ex) { throw new ApplicationException("Erro ao filtrar diário: " + ex.Message); }
    }

    public async Task<object> FiltrarPorDataEspecificaAsync(string dataEspecifica, string authHeader)
    {
        try
        {
            return await ExecuteGet<object>("DiaryFilterService",
                $"api/diary/filter?dataEspecifica={dataEspecifica}", authHeader);
        }
        catch (Exception ex) { throw new ApplicationException("Erro ao filtrar diário: " + ex.Message); }
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
            ?? throw new ApplicationException("Resposta inválida do diary-filter-service.");
    }
}