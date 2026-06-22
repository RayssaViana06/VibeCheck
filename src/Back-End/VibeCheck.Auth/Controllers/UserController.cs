using auth_service.DTOs;
using auth_service.Models;
using auth_service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace auth_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService;
        private readonly BlacklistService _blacklistService;

        public UserController(UserService userService, TokenService tokenService, BlacklistService blacklistService)
        {
            _userService = userService;
            _tokenService = tokenService;
            _blacklistService = blacklistService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<UserResponseDTO>>> GetAll()
        {
            var role = GetLoggedUserRole();

            if (role != "psicologo")
                return Forbid();

            var users = await _userService.GetAllAsync();

            var response = users.Select(u => new UserResponseDTO
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Cpf = u.Cpf,
                Crp = u.Crp,
                DataNascimento = u.DataNascimento,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToList();

            return Ok(response);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDTO>> GetById(string id)
        {
            var loggedUserId = GetLoggedUserId();

            if (loggedUserId != id)
                return Forbid();

            var user = await _userService.GetByIdAsync(id);
            if (user is null)
                return NotFound();

            return Ok(new UserResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Cpf = user.Cpf,
                Crp = user.Crp,
                DataNascimento = user.DataNascimento,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(CreateUserDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var email = dto.Email.Trim().ToLower();
            var role = dto.Role.Trim().ToLower();

            if (role != "paciente" && role != "psicologo")
                return BadRequest("Role inválida. Use 'paciente' ou 'psicologo'.");

            var existingEmail = await _userService.GetByEmailAsync(email);
            if (existingEmail is not null)
                return Conflict("E-mail já cadastrado.");

            if (role == "paciente")
            {
                if (string.IsNullOrWhiteSpace(dto.Cpf))
                    return BadRequest("CPF é obrigatório para pacientes.");

                var cpf = dto.Cpf.Trim();

                if (!IsValidCpf(cpf))
                    return BadRequest("CPF inválido.");

                var existingCpf = await _userService.GetByCpfAsync(cpf);
                if (existingCpf is not null)
                    return Conflict("CPF já cadastrado.");

                if (!string.IsNullOrWhiteSpace(dto.Crp))
                    return BadRequest("Paciente não deve informar CRP.");
            }

            if (role == "psicologo")
            {
                if (string.IsNullOrWhiteSpace(dto.Crp))
                    return BadRequest("CRP é obrigatório para psicólogos.");

                var crp = dto.Crp.Trim();

                if (!IsValidCrp(crp))
                    return BadRequest("CRP inválido.");

                var existingCrp = await _userService.GetByCrpAsync(crp);
                if (existingCrp is not null)
                    return Conflict("CRP já cadastrado.");

                if (!string.IsNullOrWhiteSpace(dto.Cpf))
                    return BadRequest("Psicólogo não deve informar CPF.");
            }

            var user = new User
            {
                Name = dto.Name.Trim(),
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = role,
                Cpf = role == "paciente" ? dto.Cpf?.Trim() : null,
                Crp = role == "psicologo" ? dto.Crp?.Trim() : null,
                DataNascimento = dto.DataNascimento,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userService.CreateAsync(user);

            var response = new UserResponseDTO
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Cpf = user.Cpf,
                Crp = user.Crp,
                DataNascimento = user.DataNascimento,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);
            if (user is null)
                return Unauthorized("E-mail ou senha inválidos.");

            bool senhaValida = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!senhaValida)
                return Unauthorized("E-mail ou senha inválidos.");

            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                message = "Login realizado com sucesso!",
                token = token,
                userId = user.Id,
                name = user.Name,
                role = user.Role
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var expiryClaim = User.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;

            DateTime expiresAt = DateTime.UtcNow.AddHours(8);
            if (expiryClaim != null)
            {
                var expiryDateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expiryClaim));
                expiresAt = expiryDateTimeOffset.UtcDateTime;
            }

            await _blacklistService.AddAsync(token, expiresAt);
            return Ok(new { message = "Logout realizado com sucesso!" });
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, UpdateUserDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var loggedUserId = GetLoggedUserId();

            if (loggedUserId != id)
                return Forbid();

            var existing = await _userService.GetByIdAsync(id);
            if (existing is null)
                return NotFound();

            var normalizedEmail = dto.Email.Trim().ToLower();

            var userWithSameEmail = await _userService.GetByEmailAsync(normalizedEmail);
            if (userWithSameEmail is not null && userWithSameEmail.Id != id)
                return Conflict("E-mail já cadastrado.");

            if (existing.Role == "paciente")
            {
                if (string.IsNullOrWhiteSpace(dto.Cpf))
                    return BadRequest("CPF é obrigatório para pacientes.");

                var cpf = dto.Cpf.Trim();

                if (!IsValidCpf(cpf))
                    return BadRequest("CPF inválido.");

                var userWithSameCpf = await _userService.GetByCpfAsync(cpf);
                if (userWithSameCpf is not null && userWithSameCpf.Id != id)
                    return Conflict("CPF já cadastrado.");

                if (!string.IsNullOrWhiteSpace(dto.Crp))
                    return BadRequest("Paciente não deve informar CRP.");

                existing.Cpf = cpf;
                existing.Crp = null;
            }

            if (existing.Role == "psicologo")
            {
                if (string.IsNullOrWhiteSpace(dto.Crp))
                    return BadRequest("CRP é obrigatório para psicólogos.");

                var crp = dto.Crp.Trim();

                if (!IsValidCrp(crp))
                    return BadRequest("CRP inválido.");

                var userWithSameCrp = await _userService.GetByCrpAsync(crp);
                if (userWithSameCrp is not null && userWithSameCrp.Id != id)
                    return Conflict("CRP já cadastrado.");

                if (!string.IsNullOrWhiteSpace(dto.Cpf))
                    return BadRequest("Psicólogo não deve informar CPF.");

                existing.Crp = crp;
                existing.Cpf = null;
            }

            existing.Name = dto.Name.Trim();
            existing.Email = normalizedEmail;
            existing.DataNascimento = dto.DataNascimento;
            existing.UpdatedAt = DateTime.UtcNow;

            await _userService.UpdateAsync(id, existing);
            return NoContent();
        }

        private string? GetLoggedUserId()
        {
            return User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        }

        private string? GetLoggedUserRole()
        {
            return User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        }

        private bool IsValidCpf(string cpf)
        {
            var cleanCpf = cpf.Trim();
            return cleanCpf.Length == 11 && cleanCpf.All(char.IsDigit);
        }

        private bool IsValidCrp(string crp)
        {
            return !string.IsNullOrWhiteSpace(crp) && crp.Trim().Length >= 4;
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var loggedUserId = GetLoggedUserId();

            if (loggedUserId != id)
                return Forbid();

            var existing = await _userService.GetByIdAsync(id);
            if (existing is null)
                return NotFound();

            await _userService.DeleteAsync(id);
            return NoContent();
        }
    }
}