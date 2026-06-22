using Atividades.Models;
using MongoDB.Driver;

namespace Atividades.Services
{
    public class DiarioService
    {
        private readonly IMongoCollection<DiarioEntrada> _diario;

        public DiarioService(IMongoCollection<DiarioEntrada> diario)
        {
            _diario = diario;
        }

        public async Task<List<DiarioEntrada>> GetByPsicologoIdAsync(string psicologoId) =>
            await _diario.Find(d => d.PsicologoId == psicologoId).ToListAsync();

   
        public async Task<List<DiarioEntrada>> GetByHumorAsync(string psicologoId, string humor) =>
            await _diario
                .Find(d => d.PsicologoId == psicologoId &&
                           d.Humor.ToLower() == humor.ToLower())
                .ToListAsync();

        
        public async Task<List<DiarioEntrada>> GetByPacienteAsync(string psicologoId, string pacienteId) =>
            await _diario
                .Find(d => d.PsicologoId == psicologoId && d.PacienteId == pacienteId)
                .ToListAsync();

        
        public async Task<List<DiarioEntrada>> GetByPeriodoAsync(
            string psicologoId, DateTime dataInicio, DateTime dataFim) =>
            await _diario
                .Find(d => d.PsicologoId == psicologoId &&
                           d.CriadoEm >= dataInicio &&
                           d.CriadoEm <= dataFim)
                .ToListAsync();
    }
}
