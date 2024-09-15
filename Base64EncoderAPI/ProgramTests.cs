using System.Text.Json;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Base64EncoderAPI;
using Microsoft.AspNetCore.Http.HttpResults;

public class EncodeControllerTests
{
    private readonly Mock<IHubContext<EncodeHub>> _hubContextMock;
    private readonly Mock<IClientProxy> _clientProxyMock;

    public EncodeControllerTests()
    {
        _hubContextMock = new Mock<IHubContext<EncodeHub>>();
        _clientProxyMock = new Mock<IClientProxy>();

        _hubContextMock.Setup(hub => hub.Clients.All).Returns(_clientProxyMock.Object);
    }

    [Fact]
    public async Task Encode_ValidInput_ReturnsOkAndSendsCharacters()
    {
        var inputText = "Hello";
        var json = JsonSerializer.Serialize(new { input = inputText});
        var request = JsonDocument.Parse(json).RootElement;
        var base64Text = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(inputText)); // Expected encoded string

        var result = await EncodeControllerHelper.ProcessRequest(request, _hubContextMock.Object);

        Assert.IsType<Ok>(result);

        _clientProxyMock.Verify(
            client => client.SendCoreAsync("ReceiveCharacter", It.IsAny<object[]>(), default),
            Times.Exactly(base64Text.Length));
    }

    [Fact]
    public async Task Encode_EmptyInput_ReturnsBadRequest()
    {
        var json = JsonSerializer.Serialize(new { input = "" });
        var request = JsonDocument.Parse(json).RootElement;

        var result = await EncodeControllerHelper.ProcessRequest(request, _hubContextMock.Object);

        var badRequestResult = Assert.IsType<BadRequest<string>>(result);
        Assert.Equal("Input cannot be null or empty.", badRequestResult.Value);
    }
}

public static class EncodeControllerHelper
{
    public static async Task<IResult> ProcessRequest(JsonElement request, IHubContext<EncodeHub> hubContext)
    {
        try
        {
            string? input = request.GetProperty("input").GetString() ?? "";
            if (string.IsNullOrEmpty(input))
            {
                return Results.BadRequest("Input cannot be null or empty.");
            }

            var base64String = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(input));

            foreach (var ch in base64String)
            {
                await Task.Delay(new Random().Next(10, 50));  // Faster delay for testing purposes
                await hubContext.Clients.All.SendAsync("ReceiveCharacter", ch);
            }

            return Results.Ok();
        }
        catch (Exception)
        {
            return Results.StatusCode(500);
        }
    }
}
