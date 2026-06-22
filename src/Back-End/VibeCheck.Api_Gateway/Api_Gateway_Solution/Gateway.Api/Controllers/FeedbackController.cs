using Gateway.Domain.Interfaces;
using Gateway.Domain.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Api.Controllers
{
    [ApiController]
    public class FeedbackController(IFeedbackServices feedbackServices) : ControllerBase
    {
        private readonly IFeedbackServices _feedbackServices = feedbackServices;

        private string AuthHeader =>
            Request.Headers["Authorization"].ToString();

        [Authorize(Roles = "psicologo")]
        [HttpPost("gateway/feedback")]
        public async Task<IActionResult> Create([FromBody] FeedbackRequest request)
        {
            var result = await _feedbackServices.CreateAsync(request, AuthHeader);
            return StatusCode(201, result);
        }

        [Authorize(Roles = "psicologo")]
        [HttpGet("gateway/feedback/paciente/{pacienteId}")]
        public async Task<IActionResult> GetByPaciente(string pacienteId)
        {
            var result = await _feedbackServices.GetByPacienteAsync(pacienteId, AuthHeader);
            return Ok(result);
        }

        [Authorize(Roles = "psicologo")]
        [HttpDelete("gateway/feedback/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _feedbackServices.DeleteAsync(id, AuthHeader);
            return NoContent();
        }

        [Authorize(Roles = "paciente")]
        [HttpGet("gateway/feedback/meus")]
        public async Task<IActionResult> GetMeus()
        {
            var result = await _feedbackServices.GetMeusAsync(AuthHeader);
            return Ok(result);
        }

        [Authorize(Roles = "paciente")]
        [HttpDelete("gateway/feedback/meus/{id}")]
        public async Task<IActionResult> Ocultar(string id)
        {
            await _feedbackServices.OcultarAsync(id, AuthHeader);
            return NoContent();
        }
    }
}