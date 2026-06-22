using Gateway.Domain.Models.AuthService;
using Gateway.Domain.Requests;

namespace Gateway.Domain.Interfaces
{
    public interface IAuthBase
    {
        Task<TokenModel> LoginAsync(LoginRequest user);
        Task<UserModel> RegisterAsync(CadastroRequest request);
        Task<string> LogoutAsync(string authorizationHeader);

        Task<List<UserModel>> GetUsersAsync(string authorizationHeader);
        Task<UserModel> GetUserByIdAsync(string id, string authorizationHeader);
        Task<UserModel?> UpdateUserAsync(string id, UpdateUserRequest request, string authorizationHeader);
        Task DeleteUserAsync(string id, string authorizationHeader);

        Task<LinkModel> SolicitarVinculoAsync(SolicitarVinculoRequest request, string authorizationHeader);
        Task<LinkModel> ResponderVinculoAsync(string id, string acao, string authorizationHeader);
        Task<List<LinkModel>> GetLinksByPacienteAsync(string pacienteId, string authorizationHeader);
        Task<List<LinkModel>> GetLinksByPsicologoAsync(string psicologoId, string authorizationHeader);
        Task<LinkModel> GetLinkByIdAsync(string id, string authorizationHeader);
        Task DeleteLinkAsync(string id, string authorizationHeader);

        Task<InternalUserModel> InternalGetUserAsync(string id);
        Task<ValidateLinkModel> InternalValidateLinkAsync(string psychologistId, string patientId);
        Task<List<InternalPatientModel>> InternalGetPatientsByPsicologoAsync(string psychologistId);
    }
}