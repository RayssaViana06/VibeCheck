using auth_service.DTOs;
using auth_service.Models;
using auth_service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VibeCheck.Interfaces;

namespace auth_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LinkController : ControllerBase
    {
        private string token =>
            Request.Headers["Authorization"].ToString();

        private readonly LinkService _linkService;
        private readonly UserService _userService;
        private readonly ICriarChat _criarChat;

        public LinkController(LinkService linkService, UserService userService, ICriarChat criarChat)
        {
            _linkService = linkService;
            _userService = userService;
            _criarChat = criarChat;
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Forbid();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Link>> GetById(string id)
        {
            var loggedUserId = GetLoggedUserId();

            var link = await _linkService.GetByIdAsync(id);
            if (link is null)
                return NotFound();

            if (link.PacienteId != loggedUserId && link.PsicologoId != loggedUserId)
                return Forbid();

            return Ok(link);
        }

        [Authorize]
        [HttpGet("paciente/{pacienteId}")]
        public async Task<ActionResult<List<Link>>> GetByPaciente(string pacienteId)
        {
            var loggedUserId = GetLoggedUserId();
            var role = GetLoggedUserRole();

            if (role == "paciente" && loggedUserId != pacienteId)
                return Forbid();

            var links = await _linkService.GetByPacienteIdAsync(pacienteId);

            if (role == "psicologo")
            {
                links = links.Where(l => l.PsicologoId == loggedUserId).ToList();
            }

            return Ok(links);
        }

        [Authorize]
        [HttpGet("psicologo/{psicologoId}")]
        public async Task<ActionResult<List<Link>>> GetByPsicologo(string psicologoId)
        {
            var loggedUserId = GetLoggedUserId();
            var role = GetLoggedUserRole();

            if (role != "psicologo")
                return Forbid();

            if (loggedUserId != psicologoId)
                return Forbid();

            var links = await _linkService.GetByPsicologoIdAsync(psicologoId);
            return Ok(links);
        }

        [Authorize]
        [HttpPost("solicitar")]
        public async Task<IActionResult> Solicitar(CreateLinkDTO dto)
        {
            var psicologoId = GetLoggedUserId();

            if (string.IsNullOrWhiteSpace(psicologoId))
                return Unauthorized();

            var psicologo = await _userService.GetByIdAsync(psicologoId);

            if (psicologo is null || psicologo.Role != "psicologo")
                return Forbid();

            var paciente = await _userService.GetByCpfAsync(dto.CpfPaciente);
            if (paciente is null)
                return NotFound("Paciente não encontrado com esse CPF.");

            var vinculos = await _linkService.GetByPacienteIdAsync(paciente.Id!);
            var jaExiste = vinculos.Any(v => v.PsicologoId == psicologoId && v.Status != "recusado");

            if (jaExiste)
                return Conflict("Já existe uma solicitação ou vínculo ativo com esse paciente.");

            var link = new Link
            {
                PacienteId = paciente.Id!,
                NomePaciente = paciente.Name,
                PsicologoId = psicologoId,
                NomePsicologo = psicologo.Name,
                Status = "pendente",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _linkService.CreateAsync(link);
            return CreatedAtAction(nameof(GetById), new { id = link.Id }, link);
        }


        [Authorize]
        [HttpPut("{id}/responder")]
        public async Task<IActionResult> Responder(string id, [FromQuery] string acao)
        {
            if (acao != "aceitar" && acao != "recusar")
                return BadRequest("Ação inválida. Use 'aceitar' ou 'recusar'.");


            var link = await _linkService.GetByIdAsync(id);
            if (link is null)
                return NotFound();


            if (link.Status != "pendente")
                return BadRequest("Essa solicitação já foi respondida.");

            if (acao == "aceitar")
                await _criarChat.CriarChat(link.PsicologoId, link.NomePsicologo, link.PacienteId, link.NomePaciente, token);

            link.Status = acao == "aceitar" ? "ativo" : "recusado";
            link.UpdatedAt = DateTime.UtcNow;

            await _linkService.UpdateAsync(id, link);

            var mensagem = acao == "aceitar" ? "aceita" : "recusada";
            return Ok(new { message = $"Solicitação {mensagem} com sucesso!" });
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var loggedUserId = GetLoggedUserId();

            var link = await _linkService.GetByIdAsync(id);
            if (link is null)
                return NotFound();

            if (link.PacienteId != loggedUserId && link.PsicologoId != loggedUserId)
                return Forbid();

            await _linkService.DeleteAsync(id);
            return NoContent();
        }

        private string? GetLoggedUserId()
        {
            return User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        }

        private string? GetLoggedUserRole()
        {
            return User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        }
    }
    
}