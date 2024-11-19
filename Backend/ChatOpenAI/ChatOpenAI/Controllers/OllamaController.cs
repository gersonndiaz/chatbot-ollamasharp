using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OllamaSharp;

namespace ChatOpenAI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OllamaController : ControllerBase
    {
        [HttpGet("models")]
        [Produces("application/json")]
        public async Task<IActionResult> GetModels()
        {
            try
            {
                var uri = new Uri("http://localhost:11434");
                var ollama = new OllamaApiClient(uri);
                var models = await ollama.ListLocalModelsAsync();

                return Ok(new { result = models });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Ocurrió un error al ejecutar el comando: {ex.Message}" });
            }
        }
    }
}
