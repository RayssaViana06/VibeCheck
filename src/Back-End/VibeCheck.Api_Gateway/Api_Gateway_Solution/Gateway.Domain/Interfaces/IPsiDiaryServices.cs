using Gateway.Domain.Models.PsiDiaryService;

namespace Gateway.Domain.Interfaces
{
    public interface IPsiDiaryServices
    {
        Task<IEnumerable<PsiDiaryModel>> GetAllAsync(string authHeader);
        Task<IEnumerable<PsiDiaryModel>> FilterByHumorAsync(string humor, string authHeader);
        Task<IEnumerable<PsiDiaryModel>> FilterByPacienteAsync(string pacienteId, string authHeader);
        Task<IEnumerable<PsiDiaryModel>> FilterByPeriodoAsync(DateTime dataInicio, DateTime dataFim, string authHeader);
    }
}
