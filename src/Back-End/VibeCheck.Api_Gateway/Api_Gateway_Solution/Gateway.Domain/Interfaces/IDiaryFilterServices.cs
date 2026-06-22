namespace Gateway.Domain.Interfaces;

public interface IDiaryFilterServices
{
    Task<object> FiltrarPorIntervaloAsync(string dataInicio, string dataFim, string authHeader);
    Task<object> FiltrarPorDataEspecificaAsync(string dataEspecifica, string authHeader);
}