using apiDiarioFiltro.Domain.Models;
using apiDiarioFiltro.Infra.Persistence.Documents;

namespace apiDiarioFiltro.Infra.Persistence.Mappers;

public static class DiaryEntryMapper
{
    public static DiaryEntry ToDomain(DiaryEntryDocument doc) => new()
    {
        Id = doc.Id,
        PacienteId = doc.PacienteId,
        Texto = doc.Texto,
        CreatedAt = doc.CreatedAt
    };

    public static DiaryEntryDocument ToDocument(DiaryEntry entity) => new()
    {
        Id = entity.Id,
        PacienteId = entity.PacienteId,
        Texto = entity.Texto,
        CreatedAt = entity.CreatedAt
    };
}