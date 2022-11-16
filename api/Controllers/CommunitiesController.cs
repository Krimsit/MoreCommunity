using System.Security.Claims;
using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CommunitiesController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;

    public CommunitiesController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    
    // Получить все сообщества
    [HttpGet]
    public async Task<ActionResult<QueryResult<List<ResponseCommunity>>>> GetAll()
    {
        List<Community> communities = await _context.Communities.ToListAsync();

        List<ResponseCommunity> responseCommunities = new List<ResponseCommunity>();

        foreach (Community community in communities)
        {
            responseCommunities.Add(CreateResponseCommunityObject(community));
        }

        return Ok(new QueryResult<List<ResponseCommunity>>(200, "Запрос успешно выполнен", responseCommunities));
    }

    // Создать сообщество
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<QueryResult<ResponseCommunity>>> Create(CreateCommunity model)
    {
        string? userId = GetUserIdFromJwtToken();
        User user = await _userManager.FindByIdAsync(userId);

        if (userId == null || user == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community community = await CreateDbCommunityObject(model);
        
        _context.Communities.Add(community);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }
        
        return StatusCode(StatusCodes.Status201Created, new QueryResult<ResponseCommunity?>(200, "Запрос успешно выполнен", CreateResponseCommunityObject(community)));
    }
    
    // Получить сообщество по id
    [HttpGet("{id}")]
    public async Task<ActionResult<QueryResult<ResponseCommunity>>> GetById(long id)
    {
        Community? community = await _context.Communities.FindAsync(id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", null));
        }

        return Ok(new QueryResult<ResponseCommunity?>(200, "Запрос успешно выполнен", CreateResponseCommunityObject(community)));
    }
    
    // Обновить конкретное сообщество
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ResponseCommunity>> Update(long id, CreateCommunity model)
    {
        Community community = await CreateDbCommunityObject(model);
        string? userId = GetUserIdFromJwtToken();
        
        if (id != community.Id || userId == null || userId != community.OwnerId)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        if (!CommunityExists(id))
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", null));
        }

        _context.Entry(community).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }
        
        return Ok(new QueryResult<ResponseCommunity?>(200, "Запрос успешно выполнен", CreateResponseCommunityObject(community)));
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
        
        string? userId = GetUserIdFromJwtToken();
        
        if (id != community.Id || userId == null || userId != community.OwnerId)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        _context.Communities.Remove(community);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        return Ok(new QueryResult<string>(200, "Сообщество успешно удалено", null));
    }
    
    // Подписка/отписка
    [Authorize]
    [HttpPost("{id}/actions")]
    public async Task<ActionResult<QueryResult<int>>> Actions(long id, CommunityAction action)
    {
        if (action.Id != id)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        Community? community = await _context.Communities.FindAsync(action.Id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", ""));
        }
        
        string? userId = GetUserIdFromJwtToken();
        User user = await _userManager.FindByIdAsync(userId);
        
        if (userId == null || userId != community.OwnerId || user == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        if (action.Action != "follow" && action.Action != "unfollow")
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Такого действия не существует", null));
        }

        switch (action.Action)
        {
            case "follow":
                return await Follow(community, user);
            case "unfollow":
                return await Unfollow(community, user);
        }

        return NoContent();
    }

    private async Task<ActionResult<QueryResult<int>>> Follow(Community community, User user)
    {
        if (user.FollowedCommunities.Contains(community.Id))
        {
            return BadRequest(new QueryResult<string>(400, "Вы уже подписанны на данное сообщество", null));
        }
        
        community.Followers = community.Followers!.Append(user.Id).ToArray();
        user.FollowedCommunities = user.FollowedCommunities.Append(community.Id).ToArray();
        
        _context.Entry(community).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await _userManager.UpdateAsync(user);
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }
        
        return Ok(new QueryResult<int>(200, "Запрос успешно выполнен", community.Followers!.Length));
    }
    
    private async Task<ActionResult<QueryResult<int>>> Unfollow(Community community, User user)
    {
        if (!user.FollowedCommunities.Contains(community.Id))
        {
            return BadRequest(new QueryResult<string>(400, "Вы не подписанны на данное сообщество", null));
        }
        
        community.Followers = community.Followers!.Where(item => item != user.Id).ToArray();
        user.FollowedCommunities = user.FollowedCommunities.Where(item => item != community.Id).ToArray();
        
        _context.Entry(community).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await _userManager.UpdateAsync(user);
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }
        
        return Ok(new QueryResult<int>(200, "Запрос успешно выполнен", community.Followers!.Length));
    }
    
    // Проверка существует ли сообщество в БД
    private bool CommunityExists(long id)
    {
        return _context.Communities.Any(item => item.Id == id);
    }

    // Получение ID пользователя из JWT токена
    private string? GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId;
    }

    // Создание объекта сообщеста, который передаётся на фронт
    private ResponseCommunity CreateResponseCommunityObject(Community community)
    {
        ResponseCommunity responseCommunity = new ResponseCommunity()
        {
            Id = community.Id,
            Avatar = community.Avatar,
            Banner = community.Banner,
            Description = community.Description,
            Followers = community.Followers!.Length,
            Keywords = community.Keywords,
            Name = community.Name
        };

        return responseCommunity;
    }

    // Создание объекта сообщеста, который записывается в БД
    private async Task<Community> CreateDbCommunityObject(CreateCommunity model)
    {
        string? userId = GetUserIdFromJwtToken();
        User user = await _userManager.FindByIdAsync(userId);

        Community community = new Community()
        {
            Id = model.Id,
            Avatar = model.Avatar,
            Banner = model.Banner,
            Description = model.Description,
            Followers = new string[] { },
            Keywords = model.Keywords,
            Name = model.Name,
            OwnerId = userId,
            User = user
        };

        return community;
    }
}