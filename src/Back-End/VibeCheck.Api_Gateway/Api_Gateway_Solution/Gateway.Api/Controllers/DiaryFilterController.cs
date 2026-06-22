using Gateway.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Api.Controllers;

[ApiController]
public class DiaryFilterController(IDiaryFilterServices diaryFilterServices) : ControllerBase
{
    private readonly IDiaryFilterServices _diaryFilterServices = diaryFilterServices;

    private string AuthHeader =>
        Request.Headers["Authorization"].ToString();

    [Authorize(Roles = "paciente, psicologo")]
    [HttpGet("gateway/diary/filter")]
    public async Task<IActionResult> Filtrar(
        [FromQuery] string? dataInicio,
        [FromQuery] string? dataFim,
        [FromQuery] string? dataEspecifica)
    {
        if (!string.IsNullOrEmpty(dataEspecifica))
        {
            var result = await _diaryFilterServices.FiltrarPorDataEspecificaAsync(dataEspecifica, AuthHeader);
            return Ok(result);
        }

        if (!string.IsNullOrEmpty(dataInicio) && !string.IsNullOrEmpty(dataFim))
        {
            var result = await _diaryFilterServices.FiltrarPorIntervaloAsync(dataInicio, dataFim, AuthHeader);
            return Ok(result);
        }

        return BadRequest("Informe dataEspecifica ou dataInicio e dataFim.");
    }
}