using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace apiDiarioFiltro.Tests;

public class DiaryApiSystemTests : IClassFixture<DiaryFilterApiFactory>
{
    private readonly DiaryFilterApiFactory _factory;

    public DiaryApiSystemTests(DiaryFilterApiFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GET_FiltrarDiario_SemToken_DeveRetornar401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/diary/filter");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}

public class DiaryFilterApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting(
            "JWT_SECRET_KEY", "chave-de-teste-com-mais-de-32-caracteres-123456");
    }
}
