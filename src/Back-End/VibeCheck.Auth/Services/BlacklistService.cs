using auth_service.Models;
using MongoDB.Driver;

namespace auth_service.Services
{
    public class BlacklistService
    {
        private readonly IMongoCollection<TokenBlacklist> _blacklist;

        public BlacklistService(IMongoDatabase database)
        {
            _blacklist = database.GetCollection<TokenBlacklist>("blacklist");
        }

        public async Task AddAsync(string token, DateTime expiresAt)
        {
            var entry = new TokenBlacklist
            {
                Token = token,
                ExpiresAt = expiresAt,
                CreatedAt = DateTime.UtcNow
            };
            await _blacklist.InsertOneAsync(entry);
        }

        public async Task<bool> IsBlacklistedAsync(string token) =>
            await _blacklist.Find(x => x.Token == token).AnyAsync();
    }
}