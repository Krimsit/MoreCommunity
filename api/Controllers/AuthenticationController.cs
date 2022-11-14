using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private IConfiguration _configuration;

    public AuthenticationController(DataContext context, IConfiguration configuration, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _configuration = configuration;
        _userManager = userManager;
        _roleManager = roleManager;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<QueryResult<object>>> Login([FromBody] LoginModel model)
    { 
        var user = await _userManager.FindByNameAsync(model.Username);

        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var token = GetToken(authClaims);

            return Ok(new QueryResult<object>(200, "Запрос успешно выполнен", new {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            }));
        }
        else
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<object>(500, "Проверьте правильно ли введён логин или пароль", new {}));
        }
        
        return Unauthorized(new QueryResult<object>(401, "Вы не авторизованы", new {}));
    }
    
    [HttpPost]
    [Route("registration")]
    public async Task<ActionResult<QueryResult<object>>> Register([FromBody] RegisterModel model)
    {
        var userExists = await _userManager.FindByNameAsync(model.Username);
        if (userExists != null)
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Такой пользователь уже существует", ""));

        IdentityUser user = new()
        {
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username
        };
        var result = await _userManager.CreateAsync(user, model.Password);
        
        if (!result.Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<object>(500, "Не удалось создать пользователя! Проверьте данные пользователя и повторите попытку", new {}));

        return Ok(new QueryResult<string>(200, "Запрос успешно выполнен", "Пользователь успешно создан"));
    }
    
    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.UtcNow.AddDays(7),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return token;
    }
}