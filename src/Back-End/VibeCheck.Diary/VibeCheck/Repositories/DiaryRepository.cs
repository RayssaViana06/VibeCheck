using MongoDB.Driver;
using Microsoft.Extensions.Configuration;
using VibeCheck_v1.Models;

namespace VibeCheck_v1.Repositories
{
    public class DiaryRepository
    {
        private readonly IMongoCollection<DiaryEntry> _diaryCollection;

        public DiaryRepository(IMongoClient mongoClient, IConfiguration configuration)
        {
            var databaseName = configuration.GetSection("MongoDbSettings:DatabaseName").Value;
            var database = mongoClient.GetDatabase(databaseName);
            _diaryCollection = database.GetCollection<DiaryEntry>("entradas_diario");
        }

        public async Task CreateEntryAsync(DiaryEntry novaEntrada)
        {
            await _diaryCollection.InsertOneAsync(novaEntrada);
        }

        public async Task<List<DiaryEntry>> GetHistoryByPatientAsync(string pacienteId)
        {
            return await _diaryCollection
                .Find(d => d.PacienteId == pacienteId)
                .SortByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateEntryAnalysisAsync(string id, AnaliseIA analise)
        {
            var filter = Builders<DiaryEntry>.Filter.Eq(d => d.Id, id);
            var update = Builders<DiaryEntry>.Update.Set(d => d.AnaliseIA, analise);
            await _diaryCollection.UpdateOneAsync(filter, update);
        }

        public async Task MarcarComoLidaAsync(string id)
        {
            var filter = Builders<DiaryEntry>.Filter.Eq(d => d.Id, id);
            var update = Builders<DiaryEntry>.Update.Set(d => d.Lida, true);
            await _diaryCollection.UpdateOneAsync(filter, update);
        }

        public async Task<long> ContarNaoLidasAsync(string pacienteId)
        {
            return await _diaryCollection
                .CountDocumentsAsync(d => d.PacienteId == pacienteId && !d.Lida);
        }
    }
}