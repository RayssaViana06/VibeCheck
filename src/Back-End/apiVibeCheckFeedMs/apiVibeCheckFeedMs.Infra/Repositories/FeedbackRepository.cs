using MongoDB.Driver;
using Microsoft.Extensions.Options;
using apiVibeCheckFeedMs.Domain.Models;
using apiVibeCheckFeedMs.Domain.Interfaces;
using apiVibeCheckFeedMs.Infra.Configurations;

namespace apiVibeCheckFeedMs.Infra.Repositories;

public class FeedbackRepository : IFeedbackRepository
{
    private readonly IMongoCollection<Feedback> _collection;

    public FeedbackRepository(IOptions<MongoDbSettings> settings)
    {
        var mongoClient = new MongoClient(settings.Value.ConnectionString);
        var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
        _collection = database.GetCollection<Feedback>(
            settings.Value.FeedbackCollectionName);
    }

    public async Task CreateAsync(Feedback feedback)
    {
        await _collection.InsertOneAsync(feedback);
    }

    public async Task<List<Feedback>> GetByPacienteIdAsync(string pacienteId)
    {
        return await _collection
            .Find(f => f.PacienteId == pacienteId && !f.OcultoParaPaciente)
            .SortByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Feedback>> GetByPsicologoIdAsync(string psicologoId, string pacienteId)
    {
        return await _collection
            .Find(f => f.PsicologoId == psicologoId && f.PacienteId == pacienteId)
            .SortByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<Feedback?> GetByIdAsync(string id)
    {
        return await _collection
            .Find(f => f.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(Feedback feedback)
    {
        await _collection.ReplaceOneAsync(f => f.Id == feedback.Id, feedback);
    }

    public async Task DeleteAsync(string id)
    {
        await _collection.DeleteOneAsync(f => f.Id == id);
    }
}