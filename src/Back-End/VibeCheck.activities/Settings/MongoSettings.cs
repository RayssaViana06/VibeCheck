namespace Atividades.Settings
{
    public class MongoSettings
    {
     
        public string ConnectionString     { get; set; } = string.Empty;
        public string DatabaseName         { get; set; } = "psicologia_db";
        public string ActivitiesCollection { get; set; } = "activities";
    
    }
}
