using Atividades.Models;
using Atividades.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Atividades.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ActivitiesController : ControllerBase
    {
        private readonly ActivityService _service;

        public ActivitiesController(ActivityService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var psicologoId = Request.Headers["X-Psicologo-Id"].ToString();
            if (string.IsNullOrEmpty(psicologoId))
                return BadRequest("PsicologoId não informado.");

            return Ok(await _service.GetByPsicologoIdAsync(psicologoId));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var activity = await _service.GetByIdAsync(id);
            if (activity == null) return NotFound();
            return Ok(activity);
        }

        
        [HttpGet("paciente/{pacienteId}")]
        public async Task<IActionResult> GetByPaciente(string pacienteId)
        {
            var atividades = await _service.GetByPacienteIdAsync(pacienteId);
            return Ok(atividades);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Activity activity)
        {
            var psicologoId = Request.Headers["X-Psicologo-Id"].ToString();
            if (!string.IsNullOrEmpty(psicologoId))
                activity.PsicologoId = psicologoId;

            await _service.CreateAsync(activity);
            return CreatedAtAction(nameof(GetById), new { id = activity.Id }, activity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Activity activity)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();
            activity.Id = id;
            activity.PsicologoId = existing.PsicologoId;
            activity.PacienteId = existing.PacienteId;
            activity.Texto = existing.Texto;
            activity.DataEntrega = existing.DataEntrega;
            activity.CreatedAt = existing.CreatedAt;
            activity.UpdatedAt = DateTime.UtcNow;

            await _service.UpdateAsync(id, activity);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}