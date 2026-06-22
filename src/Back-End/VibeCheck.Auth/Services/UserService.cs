using auth_service.Models;
using MongoDB.Driver;

namespace auth_service.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("users");
        }

        public async Task<List<User>> GetAllAsync() =>
            await _users.Find(_ => true).ToListAsync();

        public async Task<User?> GetByIdAsync(string id) =>
            await _users.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<User?> GetByEmailAsync(string email) =>
            await _users.Find(x => x.Email == email).FirstOrDefaultAsync();

        public async Task<User?> GetByCpfAsync(string cpf) =>
            await _users.Find(x => x.Cpf == cpf).FirstOrDefaultAsync();

        public async Task<User?> GetByCrpAsync(string crp) =>
           await _users.Find(x => x.Crp == crp).FirstOrDefaultAsync();

        public async Task CreateAsync(User user) =>
            await _users.InsertOneAsync(user);

        public async Task UpdateAsync(string id, User user) =>
            await _users.ReplaceOneAsync(x => x.Id == id, user);

        public async Task DeleteAsync(string id) =>
            await _users.DeleteOneAsync(x => x.Id == id);
    }
}