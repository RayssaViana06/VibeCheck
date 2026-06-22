using apiDiarioFiltro.Domain.Interfaces;
using apiDiarioFiltro.Domain.Models;
using apiDiarioFiltro.Infra.Persistence.Documents;
using apiDiarioFiltro.Infra.Persistence.Mappers;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

namespace apiDiarioFiltro.Infra.Repositories;

public class DiaryRepository : IDiaryRepository
{
    private readonly IMongoCollection<DiaryEntryDocument> _collection;

    public DiaryRepository(IConfiguration config)
    {
        var client = new MongoClient(config["MongoSettings:ConnectionString"]);
        var database = client.GetDatabase(config["MongoSettings:DatabaseName"]);

        _collection = database.GetCollection<DiaryEntryDocument>("entradas_diario");
    }

    public async Task<List<DiaryEntry>> Filtrar(
        string pacienteId,
        DateTime start,
        DateTime end)
    {
        var filter = Builders<DiaryEntryDocument>.Filter.And(
            Builders<DiaryEntryDocument>.Filter.Eq(x => x.PacienteId, pacienteId),
            Builders<DiaryEntryDocument>.Filter.Gte(x => x.CreatedAt, start),
            Builders<DiaryEntryDocument>.Filter.Lte(x => x.CreatedAt, end)
        );

        var docs = await _collection.Find(filter)
        .SortByDescending(x => x.CreatedAt)
        .ToListAsync();

        return docs.Select(DiaryEntryMapper.ToDomain).ToList();
    }
}