using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using VibeCheck_v1.Repositories;
using VibeCheck_v1.Models;
using VibeCheck_v1.Services;

namespace VibeCheck_v1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DiaryController : ControllerBase
    {
        private readonly DiaryRepository _repository;
        private readonly IAIService _aiService;

        public DiaryController(DiaryRepository repository, IAIService aiService)
        {
            _repository = repository;
            _aiService = aiService;
        }

        [HttpPost]
        public async Task<IActionResult> CriarEntrada([FromBody] DiaryEntry novaEntrada)
        {
            novaEntrada.PacienteId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            novaEntrada.CreatedAt = DateTime.UtcNow;

            await _repository.CreateEntryAsync(novaEntrada);

            var entradaId = novaEntrada.Id!;
            var pacienteId = novaEntrada.PacienteId!;
            var texto = novaEntrada.Texto!;

            _ = Task.Run(async () =>
            {
                var frases = await _aiService.AnalisarEntradaAsync(entradaId, pacienteId, texto);
                if (frases == null || frases.Count == 0) return;

                var predominante = frases.OrderByDescending(f => f.Intensidade).First().EmocaoDominante;

                var analise = new AnaliseIA
                {
                    EmocaoPredominante = predominante,
                    Frases = frases.Select(f => new FraseParaBanco
                    {
                        Trecho = f.Frase,
                        Emocao = f.EmocaoDominante,
                        Intensidade = (int)Math.Round(f.Intensidade * 10)
                    }).ToList()
                };

                await _repository.UpdateEntryAnalysisAsync(entradaId, analise);
            });

            return StatusCode(201, new { mensagem = "Entrada salva com sucesso!" });
        }

        [HttpGet("historico")]
        public async Task<IActionResult> ObterHistorico()
        {
            var pacienteId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var historico = await _repository.GetHistoryByPatientAsync(pacienteId!);
            return Ok(historico);
        }

        [HttpGet("historico/{pacienteId}")]
        public async Task<IActionResult> ObterHistoricoPaciente(string pacienteId)
        {
            var historico = await _repository.GetHistoryByPatientAsync(pacienteId);
            return Ok(historico);
        }

        [HttpPatch("{id}/lida")]
        public async Task<IActionResult> MarcarComoLida(string id)
        {
            await _repository.MarcarComoLidaAsync(id);
            return Ok(new { mensagem = "Entrada marcada como lida." });
        }

        [HttpGet("nao-lidas/{pacienteId}")]
        public async Task<IActionResult> ContarNaoLidas(string pacienteId)
        {
            var total = await _repository.ContarNaoLidasAsync(pacienteId);
            return Ok(new { naoLidas = total });
        }
    }
}