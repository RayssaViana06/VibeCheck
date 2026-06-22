namespace apiVibeCheckFeedMs.Infra.Configurations;

public class MongoDbSettings
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
    public string FeedbackCollectionName { get; set; }
}