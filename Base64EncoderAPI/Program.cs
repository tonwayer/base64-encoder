using Base64EncoderAPI;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"] ?? string.Empty;

builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder
            .WithOrigins(allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();
app.UseCors();

app.MapHub<EncodeHub>("encodehub");

app.MapPost("/api/encode", static async (JsonElement request, IHubContext<EncodeHub> hubcontext) =>
{
    string? input = request.GetProperty("input").GetString() ?? "";
    var base64String = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(input));

    foreach (var ch in base64String)
    {
        await Task.Delay(new Random().Next(1000, 5000));
        await hubcontext.Clients.All.SendAsync("ReceiveCharacter", ch);
    }

    return Results.Ok();
});

app.Run();
