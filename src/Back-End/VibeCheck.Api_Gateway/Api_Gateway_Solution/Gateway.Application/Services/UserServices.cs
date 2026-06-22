using Gateway.Domain.Interfaces;
using Gateway.Domain.Models.AuthService;
using Gateway.Domain.Requests;

namespace Gateway.Application.Services
{
    public class UserServices(IAuthBase authBase) : IUserServices
    {
        private readonly IAuthBase _authBase = authBase;

        public async Task<TokenModel> LoginAsync(LoginRequest loginRequest)
            => await _authBase.LoginAsync(loginRequest);

        public async Task<UserModel> RegisterAsync(CadastroRequest request)
            => await _authBase.RegisterAsync(request);

        public async Task<string> LogoutAsync(string authorizationHeader)
            => await _authBase.LogoutAsync(authorizationHeader);

        public async Task<List<UserModel>> GetUsersAsync(string authorizationHeader)
            => await _authBase.GetUsersAsync(authorizationHeader);

        public async Task<UserModel> GetUserByIdAsync(string id, string authorizationHeader)
            => await _authBase.GetUserByIdAsync(id, authorizationHeader);

        public async Task<UserModel?> UpdateUserAsync(string id, UpdateUserRequest request, string authorizationHeader)
    => await _authBase.UpdateUserAsync(id, request, authorizationHeader);

        public async Task DeleteUserAsync(string id, string authorizationHeader)
            => await _authBase.DeleteUserAsync(id, authorizationHeader);

        public async Task<LinkModel> SolicitarVinculoAsync(SolicitarVinculoRequest request, string authorizationHeader)
            => await _authBase.SolicitarVinculoAsync(request, authorizationHeader);

        public async Task<LinkModel> ResponderVinculoAsync(string id, string acao, string authorizationHeader)
            => await _authBase.ResponderVinculoAsync(id, acao, authorizationHeader);

        public async Task<List<LinkModel>> GetLinksByPacienteAsync(string pacienteId, string authorizationHeader)
            => await _authBase.GetLinksByPacienteAsync(pacienteId, authorizationHeader);

        public async Task<List<LinkModel>> GetLinksByPsicologoAsync(string psicologoId, string authorizationHeader)
            => await _authBase.GetLinksByPsicologoAsync(psicologoId, authorizationHeader);

        public async Task<LinkModel> GetLinkByIdAsync(string id, string authorizationHeader)
            => await _authBase.GetLinkByIdAsync(id, authorizationHeader);

        public async Task DeleteLinkAsync(string id, string authorizationHeader)
            => await _authBase.DeleteLinkAsync(id, authorizationHeader);

        public async Task<InternalUserModel> InternalGetUserAsync(string id)
            => await _authBase.InternalGetUserAsync(id);

        public async Task<ValidateLinkModel> InternalValidateLinkAsync(string psychologistId, string patientId)
            => await _authBase.InternalValidateLinkAsync(psychologistId, patientId);

        public async Task<List<InternalPatientModel>> InternalGetPatientsByPsicologoAsync(string psychologistId)
            => await _authBase.InternalGetPatientsByPsicologoAsync(psychologistId);
    }
}