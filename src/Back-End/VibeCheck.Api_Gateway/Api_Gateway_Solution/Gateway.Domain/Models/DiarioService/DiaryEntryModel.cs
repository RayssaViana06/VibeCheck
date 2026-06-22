using System;
using System.Collections.Generic;
using System.Text;

namespace Gateway.Domain.Models.DiarioService
{
    public class DiaryEntryModel
    {
        public string Id { get; set; } = string.Empty;
        public string PacienteId { get; set; } = string.Empty;
        public string Texto { get; set; } = string.Empty;
        public AnaliseIAModel? AnaliseIA { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AnaliseIAModel
    {
        public string EmocaoPredominante { get; set; } = string.Empty;
        public List<FraseParaBancoModel> Frases { get; set; } = new();
    }

    public class FraseParaBancoModel
    {
        public string Trecho { get; set; } = string.Empty;
        public string Emocao { get; set; } = string.Empty;
        public int Intensidade { get; set; }
    }
}