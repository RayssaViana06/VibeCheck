using auth_service.Models;
using MongoDB.Driver;

namespace auth_service.Services
{
    public class LinkService
    {
        private readonly IMongoCollection<Link> _links;

        public LinkService(IMongoDatabase database)
        {
            _links = database.GetCollection<Link>("links");
        }

        public async Task<List<Link>> GetAllAsync() =>
            await _links.Find(_ => true).ToListAsync();

        public async Task<Link?> GetByIdAsync(string id)
        {
            var filter = Builders<Link>.Filter.Eq("_id", MongoDB.Bson.ObjectId.Parse(id));
            return await _links.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<List<Link>> GetByPacienteIdAsync(string pacienteId) =>
            await _links.Find(x => x.PacienteId == pacienteId).ToListAsync();

        public async Task<List<Link>> GetByPsicologoIdAsync(string psicologoId) =>
            await _links.Find(x => x.PsicologoId == psicologoId).ToListAsync();

        public async Task CreateAsync(Link link) =>
            await _links.InsertOneAsync(link);

        public async Task UpdateAsync(string id, Link link)
        {
            var filter = Builders<Link>.Filter.Eq("_id", MongoDB.Bson.ObjectId.Parse(id));
            await _links.ReplaceOneAsync(filter, link);
        }

        public async Task DeleteAsync(string id)
        {
            var filter = Builders<Link>.Filter.Eq("_id", MongoDB.Bson.ObjectId.Parse(id));
            await _links.DeleteOneAsync(filter);
        }

        public async Task<Link?> GetByPsychologistAndPatientAsync(string psychologistId, string patientId) =>
    await _links.Find(x => x.PsicologoId == psychologistId && x.PacienteId == patientId)
                .FirstOrDefaultAsync();

        public async Task<List<Link>> GetActivePatientsByPsychologistIdAsync(string psychologistId) =>
            await _links.Find(x => x.PsicologoId == psychologistId && x.Status == "ativo")
                        .ToListAsync();

    }
}