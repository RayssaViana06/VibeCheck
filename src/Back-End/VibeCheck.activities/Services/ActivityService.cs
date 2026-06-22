using Atividades.Models;
using MongoDB.Driver;

namespace Atividades.Services
{
    public class ActivityService
    {
        private readonly IMongoCollection<Activity> _activities;

        public ActivityService(IMongoCollection<Activity> activities)
        {
            _activities = activities;
        }

        public async Task<List<Activity>> GetAsync() =>
            await _activities.Find(_ => true).ToListAsync();

        public async Task<Activity> GetByIdAsync(string id) =>
            await _activities.Find(a => a.Id == id).FirstOrDefaultAsync();

    
        public async Task<List<Activity>> GetByPsicologoIdAsync(string psicologoId) =>
            await _activities.Find(a => a.PsicologoId == psicologoId).ToListAsync();

        public async Task CreateAsync(Activity activity) =>
            await _activities.InsertOneAsync(activity);

        public async Task UpdateAsync(string id, Activity activity) =>
            await _activities.ReplaceOneAsync(a => a.Id == id, activity);

        public async Task DeleteAsync(string id) =>
            await _activities.DeleteOneAsync(a => a.Id == id);

        public async Task<List<Activity>> GetByPacienteIdAsync(string pacienteId) =>
             await _activities.Find(a => a.PacienteId == pacienteId).ToListAsync();
    }
}
