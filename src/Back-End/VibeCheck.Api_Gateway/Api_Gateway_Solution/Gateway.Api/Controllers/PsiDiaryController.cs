using Gateway.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Api.Controllers
{
    [ApiController]
    public class PsiDiaryController(IPsiDiaryServices psiDiaryServices) : ControllerBase
    {
        private readonly IPsiDiaryServices _psiDiaryServices = psiDiaryServices;

        private string AuthHeader =>
            Request.Headers["Authorization"].ToString();

        [Authorize]
        [HttpGet("gateway/psidiary")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _psiDiaryServices.GetAllAsync(AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("gateway/psidiary/filtro/humor")]
        public async Task<IActionResult> FilterByHumor([FromQuery] string humor)
        {
            var result = await _psiDiaryServices.FilterByHumorAsync(humor, AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("gateway/psidiary/filtro/paciente")]
        public async Task<IActionResult> FilterByPaciente([FromQuery] string pacienteId)
        {
            var result = await _psiDiaryServices.FilterByPacienteAsync(pacienteId, AuthHeader);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("gateway/psidiary/filtro/periodo")]
        public async Task<IActionResult> FilterByPeriodo(
            [FromQuery] DateTime dataInicio,
            [FromQuery] DateTime dataFim)
        {
            var result = await _psiDiaryServices.FilterByPeriodoAsync(dataInicio, dataFim, AuthHeader);
            return Ok(result);
        }
    }
}
