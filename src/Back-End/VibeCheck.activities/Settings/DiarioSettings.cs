namespace Atividades.Settings
{
    public class DiarioSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName     { get; set; } = "diario_terapeutico";
        public string DiarioCollection { get; set; } = "diaryEntries";
    }
}
