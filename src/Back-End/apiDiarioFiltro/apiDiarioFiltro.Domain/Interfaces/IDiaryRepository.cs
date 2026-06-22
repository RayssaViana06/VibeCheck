using apiDiarioFiltro.Domain.Models;

namespace apiDiarioFiltro.Domain.Interfaces;

public interface IDiaryRepository
{
    Task<List<DiaryEntry>> Filtrar(string pacienteId, DateTime start, DateTime end);
}