using Gateway.Domain.Interfaces;
using Gateway.Domain.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Api.Controllers
{
    [ApiController]
    public class AuthController(IUserServices userServices) : ControllerBase
    {
        private readonly IUserServices _userServices = userServices;

        private string AuthHeader =>
            Request.Headers["Authorization"].ToString();


        [HttpPost("gateway/auth/register")]
        public async Task<IActionResult> Register([FromBody] CadastroRequest request)
        {
            var result = await _userServices.RegisterAsync(request);
            return StatusCode(201, result);
        }

        [HttpPost("gateway/auth/login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _userServices.LoginAsync(request);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("gateway/auth/logout")]
        public async Task<IActionResult> Logout()
        {
            var result = await _userServices.LogoutAsync(AuthHeader);
            return Ok(new { message = result });
        }


        [Authorize]
        [HttpGet("gateway/auth/users")]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _userServices.GetUsersAsync(AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("gateway/auth/users/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var result = await _userServices.GetUserByIdAsync(id, AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpPut("gateway/auth/users/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
        {
            var result = await _userServices.UpdateUserAsync(id, request, AuthHeader);
            if (result is null)
                return NoContent();
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("gateway/auth/users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            await _userServices.DeleteUserAsync(id, AuthHeader);
            return NoContent();
        }


        [Authorize]
        [HttpPost("gateway/links/solicitar")]
        public async Task<IActionResult> SolicitarVinculo([FromBody] SolicitarVinculoRequest request)
        {
            var result = await _userServices.SolicitarVinculoAsync(request, AuthHeader);
            return StatusCode(201, result);
        }

        [Authorize]
        [HttpPut("gateway/links/{id}/responder")]
        public async Task<IActionResult> ResponderVinculo(string id, [FromQuery] string acao)
        {
            var result = await _userServices.ResponderVinculoAsync(id, acao, AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("gateway/links/paciente/{pacienteId}")]
        public async Task<IActionResult> GetLinksByPaciente(string pacienteId)
        {
            var result = await _userServices.GetLinksByPacienteAsync(pacienteId, AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("gateway/links/psicologo/{psicologoId}")]
        public async Task<IActionResult> GetLinksByPsicologo(string psicologoId)
        {
            var result = await _userServices.GetLinksByPsicologoAsync(psicologoId, AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("gateway/links/{id}")]
        public async Task<IActionResult> GetLinkById(string id)
        {
            var result = await _userServices.GetLinkByIdAsync(id, AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpDelete("gateway/links/{id}")]
        public async Task<IActionResult> DeleteLink(string id)
        {
            await _userServices.DeleteLinkAsync(id, AuthHeader);
            return NoContent();
        }


        [HttpGet("internal/auth/users/{id}")]
        public async Task<IActionResult> InternalGetUser(string id)
        {
            var result = await _userServices.InternalGetUserAsync(id);
            return Ok(result);
        }

        [HttpGet("internal/auth/links/validate")]
        public async Task<IActionResult> InternalValidateLink(
            [FromQuery] string psychologistId, [FromQuery] string patientId)
        {
            var result = await _userServices.InternalValidateLinkAsync(psychologistId, patientId);
            return Ok(result);
        }

        [HttpGet("internal/auth/links/psychologists/{psychologistId}/patients")]
        public async Task<IActionResult> InternalGetPatients(string psychologistId)
        {
            var result = await _userServices.InternalGetPatientsByPsicologoAsync(psychologistId);
            return Ok(result);
        }
    }
}