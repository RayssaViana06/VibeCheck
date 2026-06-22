using auth_service.Attributes;
using auth_service.DTOs;
using auth_service.Services;
using Microsoft.AspNetCore.Mvc;

namespace auth_service.Controllers
{
    [ApiController]
    [Route("internal")]
    [RequireInternalApiKey]
    public class InternalController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly LinkService _linkService;

        public InternalController(UserService userService, LinkService linkService)
        {
            _userService = userService;
            _linkService = linkService;
        }

        [HttpGet("users/{id}")]
        public async Task<ActionResult<InternalUserResponseDTO>> GetUserById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null)
                return NotFound(new { message = "Usuário não encontrado." });

            return Ok(new InternalUserResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            });
        }

        [HttpGet("links/validate")]
        public async Task<ActionResult<LinkValidationResponseDTO>> ValidateLink(
            [FromQuery] string psychologistId,
            [FromQuery] string patientId)
        {
            if (string.IsNullOrWhiteSpace(psychologistId) || string.IsNullOrWhiteSpace(patientId))
                return BadRequest(new { message = "Parâmetros inválidos." });

            var link = await _linkService.GetByPsychologistAndPatientAsync(psychologistId, patientId);

            if (link is null)
            {
                return Ok(new LinkValidationResponseDTO
                {
                    Linked = false,
                    Status = null
                });
            }

            return Ok(new LinkValidationResponseDTO
            {
                Linked = link.Status == "ativo",
                Status = link.Status
            });
        }

        [HttpGet("links/psychologists/{psychologistId}/patients")]
        public async Task<ActionResult<List<PsychologistPatientLinkDTO>>> GetPatientsByPsychologist(string psychologistId)
        {
            var links = await _linkService.GetActivePatientsByPsychologistIdAsync(psychologistId);

            var result = links.Select(link => new PsychologistPatientLinkDTO
            {
                PatientId = link.PacienteId,
                Status = link.Status
            }).ToList();

            return Ok(result);
        }
    }
}