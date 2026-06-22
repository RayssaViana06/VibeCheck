using Gateway.Domain.Interfaces;
using Gateway.Domain.Models.AuthService;
using Gateway.Domain.Requests;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace Gateway.Application.Services
{
    public class AuthServices(IHttpClientFactory httpClientFactory, IConfiguration configuration) : IAuthBase
    {
        private readonly string _internalKey = configuration["InternalApi:Key"]
            ?? throw new InvalidOperationException("InternalApi:Key não configurada.");

       
        private const string _userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";

      public async Task<TokenModel> LoginAsync(LoginRequest user)
{
    try
    {
        return await ExecutePost<LoginRequest, TokenModel>(user, "AuthClient", "api/User/login");
    }
    catch (Exception ex)
    {
        string erroOriginal = ex.Message;

       
        if (ex.InnerException is TaskCanceledException || 
            erroOriginal.Contains("HttpRequestException") || 
            erroOriginal.Contains("429") || 
            erroOriginal.Contains("Status 502") || 
            erroOriginal.Contains("Status 504") ||
            erroOriginal.Contains("Status 503"))
        {
            throw new ApplicationException("O servidor está iniciando. Por favor, aguarde alguns segundos e tente novamente.");
        }

       
        if (erroOriginal.Contains("Erro retornado pelo Auth-Service"))
        {
            
            var mensagemLimpa = erroOriginal.Replace("Erro retornado pelo Auth-Service (Status 400):", "")
                                             .Replace("Erro retornado pelo Auth-Service (Status 401):", "")
                                             .Trim();
                                             
            throw new ApplicationException(mensagemLimpa);
        }

        
        throw new ApplicationException("Ops! Algo deu errado. Tente novamente em instantes.");
    }
}

        public async Task<UserModel> RegisterAsync(CadastroRequest request)
        {
            try
            {
                return await ExecutePost<CadastroRequest, UserModel>(request, "AuthClient", "api/User/register");
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao realizar cadastro: " + ex.Message); }
        }

        public async Task<string> LogoutAsync(string authorizationHeader)
        {
            try
            {
                var client = httpClientFactory.CreateClient("AuthClient");
                var message = new HttpRequestMessage(HttpMethod.Post, "api/User/logout");
                
                message.Headers.Add("User-Agent", _userAgent);
                message.Headers.Add("Accept", "application/json");
                message.Headers.TryAddWithoutValidation("Authorization", authorizationHeader);
                
                var response = await client.SendAsync(message);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new ApplicationException($"Status {(int)response.StatusCode}: {errorContent}");
                }
                
                return "Logout realizado com sucesso!";
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao realizar logout: " + ex.Message); }
        }

        public async Task<List<UserModel>> GetUsersAsync(string authorizationHeader)
        {
            try
            {
                return await ExecuteGet<List<UserModel>>("AuthClient", "api/User", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao listar usuários: " + ex.Message); }
        }

        public async Task<UserModel> GetUserByIdAsync(string id, string authorizationHeader)
        {
            try
            {
                return await ExecuteGet<UserModel>("AuthClient", $"api/User/{id}", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao buscar usuário: " + ex.Message); }
        }

        public async Task<UserModel?> UpdateUserAsync(string id, UpdateUserRequest request, string authorizationHeader)
        {
            try
            {
                return await ExecutePut<UpdateUserRequest, UserModel>(request, "AuthClient", $"api/User/{id}", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao atualizar usuário: " + ex.Message); }
        }

        public async Task DeleteUserAsync(string id, string authorizationHeader)
        {
            try
            {
                await ExecuteDelete("AuthClient", $"api/User/{id}", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao deletar usuário: " + ex.Message); }
        }

        public async Task<LinkModel> SolicitarVinculoAsync(SolicitarVinculoRequest request, string authorizationHeader)
        {
            try
            {
                return await ExecutePost<SolicitarVinculoRequest, LinkModel>(request, "AuthClient", "api/Link/solicitar", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao solicitar vínculo: " + ex.Message); }
        }

        public async Task<LinkModel> ResponderVinculoAsync(string id, string acao, string authorizationHeader)
        {
            try
            {
                var client = httpClientFactory.CreateClient("AuthClient");
                var message = new HttpRequestMessage(HttpMethod.Put, $"api/Link/{id}/responder?acao={acao}");
                
                message.Headers.Add("User-Agent", _userAgent);
                message.Headers.Add("Accept", "application/json");
                message.Headers.TryAddWithoutValidation("Authorization", authorizationHeader);
                
                var response = await client.SendAsync(message);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new ApplicationException($"Status {(int)response.StatusCode}: {errorContent}");
                }
                
                return await response.Content.ReadFromJsonAsync<LinkModel>()
                    ?? throw new ApplicationException("Resposta inválida do auth-service.");
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao responder vínculo: " + ex.Message); }
        }

        public async Task<List<LinkModel>> GetLinksByPacienteAsync(string pacienteId, string authorizationHeader)
        {
            try
            {
                return await ExecuteGet<List<LinkModel>>("AuthClient", $"api/Link/paciente/{pacienteId}", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao listar vínculos do paciente: " + ex.Message); }
        }

        public async Task<List<LinkModel>> GetLinksByPsicologoAsync(string psicologoId, string authorizationHeader)
        {
            try
            {
                return await ExecuteGet<List<LinkModel>>("AuthClient", $"api/Link/psicologo/{psicologoId}", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao listar vínculos do psicólogo: " + ex.Message); }
        }

        public async Task<LinkModel> GetLinkByIdAsync(string id, string authorizationHeader)
        {
            try
            {
                return await ExecuteGet<LinkModel>("AuthClient", $"api/Link/{id}", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao buscar vínculo: " + ex.Message); }
        }

        public async Task DeleteLinkAsync(string id, string authorizationHeader)
        {
            try
            {
                await ExecuteDelete("AuthClient", $"api/Link/{id}", authorizationHeader);
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao deletar vínculo: " + ex.Message); }
        }

        public async Task<InternalUserModel> InternalGetUserAsync(string id)
        {
            try
            {
                return await ExecuteInternalGet<InternalUserModel>($"internal/users/{id}");
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao buscar usuário interno: " + ex.Message); }
        }

        public async Task<ValidateLinkModel> InternalValidateLinkAsync(string psychologistId, string patientId)
        {
            try
            {
                return await ExecuteInternalGet<ValidateLinkModel>(
                    $"internal/links/validate?psychologistId={psychologistId}&patientId={patientId}");
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao validar vínculo: " + ex.Message); }
        }

        public async Task<List<InternalPatientModel>> InternalGetPatientsByPsicologoAsync(string psychologistId)
        {
            try
            {
                return await ExecuteInternalGet<List<InternalPatientModel>>(
                    $"internal/links/psychologists/{psychologistId}/patients");
            }
            catch (Exception ex) { throw new ApplicationException("Erro ao listar pacientes: " + ex.Message); }
        }


   

        private async Task<TResponse> ExecutePost<TRequest, TResponse>(
            TRequest request, string clientName, string endpoint, string? authHeader = null)
        {
            var client = httpClientFactory.CreateClient(clientName);
            var message = new HttpRequestMessage(HttpMethod.Post, endpoint)
            {
                Content = new StringContent(JsonSerializer.Serialize(request), System.Text.Encoding.UTF8, "application/json")
            };

            message.Headers.Add("User-Agent", _userAgent);
            message.Headers.Add("Accept", "application/json");

            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);
                
            var response = await client.SendAsync(message);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApplicationException($"Erro retornado pelo Auth-Service (Status {(int)response.StatusCode}): {errorContent}");
            }
            
            return await response.Content.ReadFromJsonAsync<TResponse>()
                ?? throw new ApplicationException("Resposta inválida do auth-service.");
        }

        private async Task<TResponse> ExecuteGet<TResponse>(
            string clientName, string endpoint, string? authHeader = null)
        {
            var client = httpClientFactory.CreateClient(clientName);
            var message = new HttpRequestMessage(HttpMethod.Get, endpoint);
            
            message.Headers.Add("User-Agent", _userAgent);
            message.Headers.Add("Accept", "application/json");

            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);
                
            var response = await client.SendAsync(message);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApplicationException($"Erro retornado pelo Auth-Service (Status {(int)response.StatusCode}): {errorContent}");
            }
            
            return await response.Content.ReadFromJsonAsync<TResponse>()
                ?? throw new ApplicationException("Resposta inválida do auth-service.");
        }

        private async Task<TResponse?> ExecutePut<TRequest, TResponse>(
            TRequest request, string clientName, string endpoint, string? authHeader = null)
        {
            var client = httpClientFactory.CreateClient(clientName);
            var message = new HttpRequestMessage(HttpMethod.Put, endpoint)
            {
                Content = new StringContent(JsonSerializer.Serialize(request), System.Text.Encoding.UTF8, "application/json")
            };
            
            message.Headers.Add("User-Agent", _userAgent);
            message.Headers.Add("Accept", "application/json");

            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);
                
            var response = await client.SendAsync(message);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApplicationException($"Erro retornado pelo Auth-Service (Status {(int)response.StatusCode}): {errorContent}");
            }

            var content = await response.Content.ReadAsStringAsync();
            if (string.IsNullOrWhiteSpace(content))
                return default;

            return JsonSerializer.Deserialize<TResponse>(content);
        }

        private async Task ExecuteDelete(string clientName, string endpoint, string? authHeader = null)
        {
            var client = httpClientFactory.CreateClient(clientName);
            var message = new HttpRequestMessage(HttpMethod.Delete, endpoint);
            
            message.Headers.Add("User-Agent", _userAgent);
            message.Headers.Add("Accept", "application/json");

            if (!string.IsNullOrEmpty(authHeader))
                message.Headers.TryAddWithoutValidation("Authorization", authHeader);
                
            var response = await client.SendAsync(message);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApplicationException($"Erro retornado pelo Auth-Service (Status {(int)response.StatusCode}): {errorContent}");
            }
        }

        private async Task<TResponse> ExecuteInternalGet<TResponse>(string endpoint)
        {
            var client = httpClientFactory.CreateClient("AuthClient");
            var message = new HttpRequestMessage(HttpMethod.Get, endpoint);
            
            message.Headers.Add("User-Agent", _userAgent);
            message.Headers.Add("Accept", "application/json");
            message.Headers.TryAddWithoutValidation("X-Internal-Key", _internalKey);
            
            var response = await client.SendAsync(message);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new ApplicationException($"Erro retornado pelo Auth-Service (Status {(int)response.StatusCode}): {errorContent}");
            }
            
            return await response.Content.ReadFromJsonAsync<TResponse>()
                ?? throw new ApplicationException("Resposta inválida do auth-service.");
        }
    }
}