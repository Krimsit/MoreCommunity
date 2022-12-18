using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using api.Models;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TestController : ControllerBase
{
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
        _logger = logger;
        _logger.LogDebug(1, "NLog injected into HomeController");
    }
    
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        _logger.LogInformation("[GET /api/test]: Test info");
        return Ok(new QueryResult<object>(200, "Запрос успешно выполнен", new { title = "Запрос из API" }));
    }
    
    [Authorize]
    [HttpGet("identity")]
    public async Task<IActionResult> Identity()
    {
        return Ok(new QueryResult<object>(200, "Запрос успешно выполнен", new { title = "Вы авторизованы" }));
    }
}