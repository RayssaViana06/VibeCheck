using System.Security.Claims;
using Atividades.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Atividades.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "psicologo")]
    public class DiarioController : ControllerBase
    {
        private readonly DiarioService _diarioService;

        public DiarioController(DiarioService diarioService)
        {
            _diarioService = diarioService;
        }

        
        private string? GetPsicologoIdDoToken() =>
            User.FindFirstValue("sub")
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var psicologoId = GetPsicologoIdDoToken();
            if (psicologoId == null) return Unauthorized("PsicologoId não encontrado no token.");

            return Ok(await _diarioService.GetByPsicologoIdAsync(psicologoId));
        }

        
        [HttpGet("filtro/humor")]
        public async Task<IActionResult> GetByHumor([FromQuery] string humor)
        {
            var psicologoId = GetPsicologoIdDoToken();
            if (psicologoId == null) return Unauthorized("PsicologoId não encontrado no token.");

            return Ok(await _diarioService.GetByHumorAsync(psicologoId, humor));
        }

        
        [HttpGet("filtro/paciente")]
        public async Task<IActionResult> GetByPaciente([FromQuery] string pacienteId)
        {
            var psicologoId = GetPsicologoIdDoToken();
            if (psicologoId == null) return Unauthorized("PsicologoId não encontrado no token.");

            return Ok(await _diarioService.GetByPacienteAsync(psicologoId, pacienteId));
        }

        
        [HttpGet("filtro/periodo")]
        public async Task<IActionResult> GetByPeriodo(
            [FromQuery] DateTime dataInicio,
            [FromQuery] DateTime dataFim)
        {
            var psicologoId = GetPsicologoIdDoToken();
            if (psicologoId == null) return Unauthorized("PsicologoId não encontrado no token.");

            return Ok(await _diarioService.GetByPeriodoAsync(psicologoId, dataInicio, dataFim));
        }
    }
}
