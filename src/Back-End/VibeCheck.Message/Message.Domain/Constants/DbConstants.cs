namespace Message.Domain.Constants
{
    public static class DbConstants
    {
        // Nomes das conexões
        public static string MONGO_URI_USER = "MONGO_USER_URI";
        public static string MONGO_URI_MESSAGE = "MONGO_MESSAGE_URI";
        

        // Nomes dos bancos de dados
        public static string BANCO_USER = "auth-service";
        public static string BANCO_MESSAGE = "Conversas";
     

        // Nomes das coleções
        public static string COLLECTION_USERS = "users";
        public static string COLLECTION_MESSAGES = "Message";
        public static string COLLECTION_CHATS = "Chat";
    }
}
