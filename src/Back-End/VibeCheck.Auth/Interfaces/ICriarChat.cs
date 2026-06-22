namespace VibeCheck.Interfaces
{
    public interface ICriarChat
    {
        Task CriarChat(string psicologoId, string nomePsicologo, string pacienteId, string nomePaciente, string token);
    }
}
