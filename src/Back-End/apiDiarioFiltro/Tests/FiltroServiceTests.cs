using apiDiarioFiltro.Api.Services;
using apiDiarioFiltro.Domain.Interfaces;
using apiDiarioFiltro.Domain.Models;
using Moq;
using Xunit;

namespace Tests;

public class FiltroServiceTests
{
    private readonly Mock<IDiaryRepository> _repositoryMock;
    private readonly DiaryService _service;

    public FiltroServiceTests()
    {
        _repositoryMock = new Mock<IDiaryRepository>();
        _service = new DiaryService(_repositoryMock.Object);
    }

    [Fact]
    public async Task Filtrar_DeveRetornarEntradas_QuandoDadosValidos()
    {
        var pacienteId = "507f1f77bcf86cd799439011";
        var start = DateTime.Today.AddDays(-7);
        var end = DateTime.Today;
        var entradas = new List<DiaryEntry>
        {
            new DiaryEntry { Id = "1", PacienteId = pacienteId, Texto = "Entrada 1", CreatedAt = DateTime.Today }
        };

        _repositoryMock.Setup(r => r.Filtrar(pacienteId, start, end))
            .ReturnsAsync(entradas);

        var result = await _service.Filtrar(pacienteId, start, end);

        Assert.NotNull(result);
        Assert.Single(result);
    }

    [Fact]
    public async Task Filtrar_DeveLancarExcecao_QuandoPacienteIdVazio()
    {
        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.Filtrar("", DateTime.Today.AddDays(-7), DateTime.Today));
    }

    [Fact]
    public async Task Filtrar_DeveLancarExcecao_QuandoDataInicioMaiorQueDataFim()
    {
        var pacienteId = "507f1f77bcf86cd799439011";

        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.Filtrar(pacienteId, DateTime.Today, DateTime.Today.AddDays(-7)));
    }

    [Fact]
    public async Task Filtrar_DeveRetornarListaVazia_QuandoNaoHaEntradas()
    {
        var pacienteId = "507f1f77bcf86cd799439011";
        var start = DateTime.Today.AddDays(-7);
        var end = DateTime.Today;

        _repositoryMock.Setup(r => r.Filtrar(pacienteId, start, end))
            .ReturnsAsync(new List<DiaryEntry>());

        var result = await _service.Filtrar(pacienteId, start, end);

        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task Filtrar_DeveRetornarEntradas_QuandoDataEspecifica()
    {
        var pacienteId = "507f1f77bcf86cd799439011";
        var dataEspecifica = DateTime.Today;
        var end = dataEspecifica.AddDays(1);
        var entradas = new List<DiaryEntry>
        {
            new DiaryEntry { Id = "1", PacienteId = pacienteId, Texto = "Entrada 1", CreatedAt = DateTime.Today }
        };

        _repositoryMock.Setup(r => r.Filtrar(pacienteId, dataEspecifica, end))
            .ReturnsAsync(entradas);

        var result = await _service.Filtrar(pacienteId, dataEspecifica, end);

        Assert.NotNull(result);
        Assert.Single(result);
    }
}