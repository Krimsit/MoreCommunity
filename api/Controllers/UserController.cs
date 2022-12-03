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

public class UserController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private GetResponseObject _getResponseObject = new GetResponseObject();
    
    public UserController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    
    [HttpGet]
    public async Task<ActionResult<QueryResult<UserResponse>>> Get()
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        return Ok(new QueryResult<UserResponse>(200, "Запрос успешно выполнен", user == null ? null :_getResponseObject.User(user)));
    }
    
    [Authorize]
    [HttpPut]
    public async Task<ActionResult<QueryResult<UserResponse>>> Update([FromBody] UpdateUser newUserData)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизациuser = {User} Test Update ей. Попробуйте перезайти", null));
        }

        user.Avatar = newUserData.Avatar;
        user.UserName = newUserData.Username;
        user.Email = newUserData.Email;
        
        IdentityResult result = await _userManager.UpdateAsync(user);
        
        if (!result.Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Не удалось обновить пользователя! Проверьте данные пользователя и повторите попытку", null));

        return Ok(new QueryResult<UserResponse>(200, "Запрос успешно выполнен", _getResponseObject.User(user)));
    }
    
    [Authorize]
    [HttpDelete]
    public async Task<ActionResult<QueryResult<UserResponse>>> Delete()
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        IdentityResult result = await _userManager.DeleteAsync(user);
        
        if (!result.Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Не удалить обновить пользователя! Проверьте данные пользователя и повторите попытку", null));

        return Ok(new QueryResult<bool>(200, "Запрос успешно выполнен", result.Succeeded));
    }
    
    [Authorize]
    [HttpGet]
    [Route("my-communities")]
    public async Task<ActionResult<QueryResult<UserResponse>>> GetMyCommunities()
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _context.Users.Include("MyCommunities").Where(item => item.Id == userId)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        List<ResponseCommunity> myCommunities = new List<ResponseCommunity>();

        foreach (Community community in user.MyCommunities)
        {
            myCommunities.Add(_getResponseObject.Community(community, user));
        }
        
        return Ok(new QueryResult<List<ResponseCommunity>>(200, "Запрос успешно выполнен", myCommunities));
    }
    
    [Authorize]
    [HttpGet]
    [Route("followed-communities")]
    public async Task<ActionResult<QueryResult<UserResponse>>> GetFollowedCommunities()
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        List<Community> communities = await _context.Communities.ToListAsync();
        List<ResponseCommunity> followedCommunities = new List<ResponseCommunity>();

        foreach (Community community in communities)
        {
            if (user.FollowedCommunities.Contains(community.Id) && community.OwnerId != user.Id)
            {
                followedCommunities.Add(_getResponseObject.Community(community, user));
            }
        }
        
        return Ok(new QueryResult<List<ResponseCommunity>>(200, "Запрос успешно выполнен", followedCommunities));
    }

    [NonAction]
    private string GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId ?? "";
    }
}