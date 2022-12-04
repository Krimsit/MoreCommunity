using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

using api.Models;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthenticationController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;

    public AuthenticationController(IConfiguration configuration, UserManager<User> userManager)
    {
        _configuration = configuration;
        _userManager = userManager;
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
                new Claim(ClaimTypes.Name, user.Id),
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

        return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<object>(500, "Проверьте правильно ли введён логин или пароль", new {}));
    }
    
    [HttpPost]
    [Route("registration")]
    public async Task<ActionResult<QueryResult<object>>> Register([FromBody] RegisterModel model)
    {
        var userExists = await _userManager.FindByNameAsync(model.Username);
        if (userExists != null)
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Такой пользователь уже существует", ""));

        User user = new()
        {
            Avatar = model.Avatar,
            Email = model.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = model.Username
        };
        
        var result = await _userManager.CreateAsync(user, model.Password);
        
        if (!result.Succeeded)
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Не удалось создать пользователя! Проверьте данные пользователя и повторите попытку", null));
        
        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = GetToken(authClaims);

        return Ok(new QueryResult<object>(200, "Запрос успешно выполнен", new {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo
        }));
    }
    
    [NonAction]
    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"] ?? string.Empty));

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