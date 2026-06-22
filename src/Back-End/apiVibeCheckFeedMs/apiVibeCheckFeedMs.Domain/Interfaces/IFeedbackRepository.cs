using apiVibeCheckFeedMs.Domain.Models;

namespace apiVibeCheckFeedMs.Domain.Interfaces;

public interface IFeedbackRepository
{
    Task CreateAsync(Feedback feedback);
    Task<List<Feedback>> GetByPacienteIdAsync(string pacienteId);
    Task<List<Feedback>> GetByPsicologoIdAsync(string psicologoId, string pacienteId);
    Task<Feedback?> GetByIdAsync(string id);
    Task UpdateAsync(Feedback feedback);
    Task DeleteAsync(string id);
}