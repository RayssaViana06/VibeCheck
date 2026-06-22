using apiDiarioFiltro.Domain.Interfaces;
using apiDiarioFiltro.Domain.Models;
using apiDiarioFiltro.Infra.Repositories;

namespace apiDiarioFiltro.Api.Services;

public class DiaryService
{
    private readonly IDiaryRepository _repo;

    public DiaryService(IDiaryRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<DiaryEntry>> Filtrar(
        string pacienteId,
        DateTime start,
        DateTime end)
    {
        // 🔒 Validação básica (protege contra erro silencioso)
        if (string.IsNullOrEmpty(pacienteId))
            throw new ArgumentException("PacienteId inválido.");

        if (start > end)
            throw new ArgumentException("A data inicial não pode ser maior que a final.");

        return await _repo.Filtrar(pacienteId, start, end);
    }
}