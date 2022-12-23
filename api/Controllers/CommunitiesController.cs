using System.Data.Common;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Helpers;
using api.Models;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CommunitiesController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private GetResponseObject _getResponseObject = new GetResponseObject();

    public CommunitiesController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // Получить все сообщества
    [HttpGet]
    public async Task<ActionResult<QueryResult<List<ResponseCommunity>>>> GetAll()
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        List<Community> communities = await _context.Communities.ToListAsync();

        List<ResponseCommunity> responseCommunities = new List<ResponseCommunity>();

        foreach (Community community in communities)
        {
            responseCommunities.Add(_getResponseObject.Community(community, user));
        }

        return Ok(new QueryResult<List<ResponseCommunity>>(200, "Запрос успешно выполнен", responseCommunities));
    }

    // Создать сообщество
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<QueryResult<ResponseCommunity>>> Create([FromBody] CreateCommunity model)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community community = new Community()
        {
            Id = model.Id,
            Avatar = model.Avatar,
            Banner = model.Banner,
            Description = model.Description,
            Followers = new string[] { },
            Keywords = model.Keywords,
            Name = model.Name,
            OwnerId = user.Id,
            StreamId = String.Empty
        };

        _context.Communities.Add(community);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        return StatusCode(StatusCodes.Status201Created,
            new QueryResult<ResponseCommunity?>(200, "Запрос успешно выполнен",
                _getResponseObject.Community(community, null)));
    }

    // Получить сообщество по id
    [HttpGet("{id}")]
    public async Task<ActionResult<QueryResult<ResponseCommunity>>> GetById(long id)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        Community? community = await _context.Communities.FindAsync(id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", null));
        }

        return Ok(new QueryResult<ResponseCommunity?>(200, "Запрос успешно выполнен",
            _getResponseObject.Community(community, user)));
    }

    // Обновить конкретное сообщество
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ResponseCommunity>> Update(long id, [FromBody] CreateCommunity model)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community? community = await _context.Communities.FindAsync(id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", null));
        }

        community.Avatar = model.Avatar;
        community.Banner = model.Banner;
        community.Description = model.Description;
        community.Keywords = model.Keywords;
        community.Name = model.Name;

        _context.Entry(community).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        return Ok(new QueryResult<ResponseCommunity?>(200, "Запрос успешно выполнен",
            _getResponseObject.Community(community, null)));
    }

    // Удалить конкретное сообщество
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        Community? community = await _context.Communities.FindAsync(id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", ""));
        }

        string userId = GetUserIdFromJwtToken();

        if (id != community.Id || userId != community.OwnerId)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        _context.Communities.Remove(community);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        return Ok(new QueryResult<bool>(200, "Сообщество успешно удалено", true));
    }

    // Подписка/отписка
    [Authorize]
    [HttpPost("{id}/follow")]
    public async Task<ActionResult<QueryResult<FollowCommunity>>> Actions(long id)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        Community? community = await _context.Communities.FindAsync(id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", ""));
        }

        bool isMyFollow;

        if (!user.FollowedCommunities.Contains(community.Id))
        {
            community.Followers = community.Followers.Append(user.Id).ToArray();
            user.FollowedCommunities = user.FollowedCommunities.Append(community.Id).ToArray();
            isMyFollow = true;
        }
        else
        {
            community.Followers = community.Followers.Where(item => item != user.Id).ToArray();
            user.FollowedCommunities = user.FollowedCommunities.Where(item => item != community.Id).ToArray();
            isMyFollow = false;
        }

        try
        {
            await _context.SaveChangesAsync();
            await _userManager.UpdateAsync(user);
        }
        catch (DbException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли непредвиденные ошибки", null));
        }

        return Ok(new QueryResult<FollowCommunity>(200, "Запрос успешно выполнен",
            new FollowCommunity() { isMyFollow = isMyFollow, count = community.Followers.Length }));
    }

    [HttpGet("popular")]
    public async Task<ActionResult<QueryResult<List<ResponseCommunity>>>> GetPopulars()
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        List<Community> communities = await _context.Communities.ToListAsync();

        List<ResponseCommunity> responseCommunities = new List<ResponseCommunity>();

        foreach (Community community in communities)
        {
            responseCommunities.Add(_getResponseObject.Community(community, user));
        }

        return Ok(new QueryResult<List<ResponseCommunity>>(200, "Запрос успешно выполнен", responseCommunities));
    }

    // Получение ID пользователя из JWT токена
    [NonAction]
    private string GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId ?? "";
    }
}