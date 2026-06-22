using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace DiarioService.Tests;

public class DiaryApiSystemTests : IClassFixture<DiaryApiFactory>
{
    private readonly DiaryApiFactory _factory;

    public DiaryApiSystemTests(DiaryApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task POST_Diary_SemToken_DeveRetornar401()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsync("/api/diary", null);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GET_Historico_ComTokenValido_DeveRetornar200()
    {
        var client = _factory.CreateClient();
        var token = _factory.GerarToken($"paciente-teste-{Guid.NewGuid():N}");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/diary/historico");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}

public class DiaryApiFactory : WebApplicationFactory<Program>
{
    public const string ChaveJwt = "chave-de-teste-com-mais-de-32-caracteres-123456";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("Jwt:Key", ChaveJwt);
    }

    public string GerarToken(string pacienteId)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ChaveJwt));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "auth-service",
            audience: "vibecheck-app",
            claims: new[]
            {
                new Claim(ClaimTypes.NameIdentifier, pacienteId),
                new Claim(ClaimTypes.Role, "paciente")
            },
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
