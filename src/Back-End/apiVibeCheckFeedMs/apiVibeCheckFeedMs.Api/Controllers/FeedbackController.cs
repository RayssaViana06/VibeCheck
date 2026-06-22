using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using apiVibeCheckFeedMs.Api.Services;
using apiVibeCheckFeedMs.Domain.Dtos;
using System.Security.Claims;

namespace apiVibeCheckFeedMs.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FeedbackController : ControllerBase
{
    private readonly FeedbackService _service;

    public FeedbackController(FeedbackService service)
    {
        _service = service;
    }

    [Authorize(Roles = "psicologo")]
    [HttpPost]
    [ProducesResponseType(typeof(FeedbackResponseDto), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Create([FromBody] CreateFeedbackDto dto)
    {
        try
        {
            var psicologoId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(psicologoId))
                return Unauthorized();
            var feedback = await _service.CreateAsync(dto, psicologoId);
            var response = new FeedbackResponseDto
            {
                Id = feedback.Id,
                Texto = feedback.Texto,
                CreatedAt = feedback.CreatedAt,
                PsicologoNome = feedback.PsicologoNome,
                PsicologoId = feedback.PsicologoId
            };
            return StatusCode(201, response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "paciente")]
    [HttpGet("meus")]
    [ProducesResponseType(typeof(List<FeedbackResponseDto>), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GetMeus()
    {
        var pacienteId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(pacienteId))
            return Unauthorized();
        var feedbacks = await _service.GetByPacienteIdAsync(pacienteId);
        var response = feedbacks.Select(f => new FeedbackResponseDto
        {
            Id = f.Id,
            Texto = f.Texto,
            CreatedAt = f.CreatedAt,
            PsicologoNome = f.PsicologoNome,
            PsicologoId = f.PsicologoId
        });
        return Ok(response);
    }

    [Authorize(Roles = "psicologo")]
    [HttpGet("paciente/{pacienteId}")]
    [ProducesResponseType(typeof(List<FeedbackResponseDto>), 200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> GetByPaciente(string pacienteId)
    {
        var psicologoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(psicologoId))
            return Unauthorized();
        var feedbacks = await _service.GetByPsicologoIdAsync(psicologoId, pacienteId);
        var response = feedbacks.Select(f => new FeedbackResponseDto
        {
            Id = f.Id,
            Texto = f.Texto,
            CreatedAt = f.CreatedAt,
            PsicologoNome = f.PsicologoNome,
            PsicologoId = f.PsicologoId
        });
        return Ok(response);
    }

    [Authorize(Roles = "paciente")]
    [HttpDelete("meus/{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Ocultar(string id)
    {
        var pacienteId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(pacienteId))
            return Unauthorized();
        try
        {
            await _service.OcultarParaPacienteAsync(id, pacienteId);
            return NoContent();
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [Authorize(Roles = "psicologo")]
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(string id)
    {
        var psicologoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(psicologoId))
            return Unauthorized();
        try
        {
            await _service.DeleteAsync(id, psicologoId);
            return NoContent();
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
