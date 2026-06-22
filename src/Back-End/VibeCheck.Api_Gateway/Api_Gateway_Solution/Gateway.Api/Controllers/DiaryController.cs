using Gateway.Domain.Models.DiarioService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Gateway.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DiaryController : ControllerBase
    {
        private readonly HttpClient _diarioClient;

        public DiaryController(IHttpClientFactory httpClientFactory)
        {
            _diarioClient = httpClientFactory.CreateClient("DiarioClient");
        }

        [HttpPost]
        public async Task<IActionResult> CriarEntrada([FromBody] object body)
        {
            AdicionarTokenNoHeader();

            var json = JsonSerializer.Serialize(body);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _diarioClient.PostAsync("/api/diary", content);
            var result = await response.Content.ReadAsStringAsync();

            return StatusCode((int)response.StatusCode, result);
        }

        [HttpGet("historico")]
        public async Task<IActionResult> ObterHistorico()
        {
            AdicionarTokenNoHeader();

            var response = await _diarioClient.GetAsync("/api/diary/historico");
            var result = await response.Content.ReadAsStringAsync();

            return StatusCode((int)response.StatusCode, result);
        }

        private void AdicionarTokenNoHeader()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _diarioClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }
    }
}