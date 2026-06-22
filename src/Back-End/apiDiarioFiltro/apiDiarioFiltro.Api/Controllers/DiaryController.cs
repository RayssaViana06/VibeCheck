using Microsoft.AspNetCore.Mvc;
using apiDiarioFiltro.Api.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace apiDiarioFiltro.Api.Controllers;

[ApiController]
[Route("api/diary")]
[Authorize]
public class DiaryController : ControllerBase
{
    private readonly DiaryService _service;

    public DiaryController(DiaryService service)
    {
        _service = service;
    }

    [HttpGet("filter")]
    public async Task<IActionResult> Filtrar(
        [FromQuery] DateTime? dataEspecifica,
        [FromQuery] DateTime? dataInicio,
        [FromQuery] DateTime? dataFim)
    {
        // Pega o ID do usuário
        var pacienteId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        Console.WriteLine($"PacienteId do token: {pacienteId}");

        if (string.IsNullOrEmpty(pacienteId))
            return Unauthorized();

        DateTime start;
        DateTime end;

        //Filtros - Prioriza dataEspecifica, depois intervalo, e valida ambos
        
        if (dataEspecifica.HasValue)
        {
            start = dataEspecifica.Value.Date;
            end = dataEspecifica.Value.Date.AddDays(1).AddTicks(-1);
        }
        else if (dataInicio.HasValue && dataFim.HasValue)
        {
            if (dataInicio > dataFim)
                return BadRequest("dataInicio não pode ser maior que dataFim.");

            start = dataInicio.Value;
            end = dataFim.Value;
        }
        
        else
        {
            return BadRequest("Informe dataEspecifica ou intervalo (dataInicio e dataFim).");
        }

        
        var result = await _service.Filtrar(pacienteId, start, end);

        return Ok(result);
    }
}