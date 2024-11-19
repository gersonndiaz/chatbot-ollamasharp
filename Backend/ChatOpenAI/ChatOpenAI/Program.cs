using ChatOpenAI.Hubs.Ollama;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

//builder.Services.AddSignalR();

builder.Services.AddSignalR(hubOptions =>
{
    // 20 MB en bytes
    hubOptions.MaximumReceiveMessageSize = 20 * 1024 * 1024;
});

builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin",
            builder =>
            {
                builder.WithOrigins("http://localhost:4200", "http://localhost")
                       .AllowAnyHeader()
                       .AllowAnyMethod()
                       .AllowCredentials();
            });
    });

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

app.UseRouting();

app.MapControllers();

app.MapHub<ChatHub>("/hubs/chat");

app.Run();
