namespace Message.Domain.Exceptions
{
    public class ApiException
    {
        public string StatusCode { get; set; }
        public string Message { get; set; }
        public string Datails { get; set; }
    }
}
