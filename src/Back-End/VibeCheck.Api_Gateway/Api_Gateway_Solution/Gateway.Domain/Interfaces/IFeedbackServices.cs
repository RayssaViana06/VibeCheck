using Gateway.Domain.Requests;

namespace Gateway.Domain.Interfaces;

public interface IFeedbackServices
{
    Task<object> CreateAsync(FeedbackRequest request, string authHeader);
    Task<object> GetByPacienteAsync(string pacienteId, string authHeader);
    Task DeleteAsync(string id, string authHeader);
    Task<object> GetMeusAsync(string authHeader);
    Task OcultarAsync(string id, string authHeader);
}