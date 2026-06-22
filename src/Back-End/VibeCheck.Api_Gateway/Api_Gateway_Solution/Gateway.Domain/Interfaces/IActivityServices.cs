using Gateway.Domain.Models.ActivityService;

namespace Gateway.Domain.Interfaces
{
    public interface IActivityServices
    {
        
        Task<IEnumerable<ActivityModel>> GetAllAsync(string authHeader);

    
        Task<ActivityModel> GetByIdAsync(string id, string authHeader);

        
        Task<ActivityModel> CreateAsync(object body, string authHeader);

        
        Task UpdateAsync(string id, object body, string authHeader);

        
        Task DeleteAsync(string id, string authHeader);
    }
}
