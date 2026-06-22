using apiVibeCheckFeedMs.Domain.Dtos;
using apiVibeCheckFeedMs.Domain.Interfaces;
using apiVibeCheckFeedMs.Domain.Models;

namespace apiVibeCheckFeedMs.Api.Services;

public class FeedbackService
{
    private readonly IFeedbackRepository _repository;

    public FeedbackService(IFeedbackRepository repository)
    {
        _repository = repository;
    }

    public async Task<Feedback> CreateAsync(CreateFeedbackDto dto, string psicologoId)
    {
        if (string.IsNullOrWhiteSpace(dto.Texto))
            throw new ArgumentException("Texto é obrigatório");
        if (dto.Texto.Length < 5)
            throw new ArgumentException("Texto deve ter pelo menos 5 caracteres");
        if (dto.Texto.Length > 500)
            throw new ArgumentException("Texto muito longo");
        if (string.IsNullOrWhiteSpace(dto.PacienteId))
            throw new ArgumentException("PacienteId é obrigatório");
        if (dto.PacienteId.Length < 3)
            throw new ArgumentException("PacienteId inválido");

        // 🔴 VALIDAÇÃO DE VÍNCULO
        /* var vinculoExiste = await _httpClient.GetAsync(
            $"https://vinculo-service/api/links/{dto.PacienteId}/{psicologoId}");
        if (!vinculoExiste.IsSuccessStatusCode)
            throw new ArgumentException("Paciente não vinculado a este psicólogo");*/

        var feedback = new Feedback
        {
            PacienteId = dto.PacienteId,
            PsicologoId = psicologoId,
            PsicologoNome = dto.PsicologoNome,
            Texto = dto.Texto,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.CreateAsync(feedback);
        return feedback;
    }

    public async Task<List<Feedback>> GetByPacienteIdAsync(string pacienteId)
    {
        return await _repository.GetByPacienteIdAsync(pacienteId);
    }

    public async Task<List<Feedback>> GetByPsicologoIdAsync(string psicologoId, string pacienteId)
    {
        return await _repository.GetByPsicologoIdAsync(psicologoId, pacienteId);
    }

    public async Task OcultarParaPacienteAsync(string id, string pacienteId)
    {
        var feedback = await _repository.GetByIdAsync(id);
        if (feedback == null)
            throw new ArgumentException("Feedback não encontrado");
        if (feedback.PacienteId != pacienteId)
            throw new UnauthorizedAccessException();
        feedback.OcultoParaPaciente = true;
        await _repository.UpdateAsync(feedback);
    }

    public async Task DeleteAsync(string id, string psicologoId)
    {
        var feedback = await _repository.GetByIdAsync(id);
        if (feedback == null)
            throw new ArgumentException("Feedback não encontrado");
        if (feedback.PsicologoId != psicologoId)
            throw new UnauthorizedAccessException();
        await _repository.DeleteAsync(id);
    }
}