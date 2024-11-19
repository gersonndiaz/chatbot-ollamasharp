using Microsoft.AspNetCore.SignalR;
using OllamaSharp;

namespace ChatOpenAI.Hubs.Ollama;

public class ChatHub : Hub
{
    public async Task GetMessage(string message, string modelName)
    {
        var uri = new Uri("http://localhost:11434");
        var ollama = new OllamaApiClient(uri);
        
        if (!String.IsNullOrEmpty(modelName))
        {
            ollama.SelectedModel = modelName;
        }
        else
        {
            ollama.SelectedModel = "llama3.2";
        }

        string mId = Guid.NewGuid().ToString();

        var chat = new Chat(ollama);

        // Envía el mensaje al chat y procesa la respuesta en tiempo real
        await foreach (var response in chat.SendAsync(message))
        {
            if (!string.IsNullOrEmpty(response))
            {
                Console.WriteLine(response);
                // Envía la respuesta al cliente en tiempo real
                await Clients.Caller.SendAsync("ReceiveMessage", response, mId);
            }
        }
    }
}
    
