using Microsoft.AspNetCore.Mvc;
using VibeCheck_v1.Services;

namespace VibeCheck_v1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwt;

        public AuthController(JwtService jwtService)
        {
            _jwt = jwtService;
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Senha { get; set; } = string.Empty;
        }
        
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            // Simulação de validação
            if (dto.Email == "teste@email.com" && dto.Senha == "123")
            {
                var token = _jwt.GenerateToken("1", dto.Email);
                return Ok(new { token });
            }
            return Unauthorized();
        }
    }
}