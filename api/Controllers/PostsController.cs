using System.Security.Claims;
using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/communities/{communityId}/[controller]")]
[Produces("application/json")]

public class PostsController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;

    public PostsController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll(long communityId)
    {
        Community community = await _context.Communities.Include("Posts").Where(item => item != null && item.Id == communityId).FirstOrDefaultAsync();
        
        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        IOrderedEnumerable<Post> posts = community.Posts.OrderBy(item => item!.CreatedAt)!;

        List<ResponsePost> responsePosts = new List<ResponsePost>();

        foreach (Post post in posts)
        {
            responsePosts.Add(CreateResponsePostObject(post));
        }    

        return Ok(new QueryResult<List<ResponsePost>>(200, "Запрос успешно выполнен", responsePosts));
    }
    
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<QueryResult<ResponsePost>>> Create(long communityId, CreatePost model)
    {
        string? userId = GetUserIdFromJwtToken();
        
        if (userId == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        Community? community = await _context.Communities.FindAsync(communityId);
        
        if (community == null || community.OwnerId != userId)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post post = await CreateDbPostObject(communityId, model);
        
        _context.Posts.Add(post);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при создании поста", null));
        }
        
        return StatusCode(StatusCodes.Status201Created, new QueryResult<ResponsePost?>(200, "Пост успешно создан", CreateResponsePostObject(post)));
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<QueryResult<ResponsePost>>> GetById(long communityId, long id)
    {
        Community? community = await _context.Communities.Include("Posts").Where(item => item != null && item.Id == communityId).FirstOrDefaultAsync();

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post? post = community.Posts.FirstOrDefault(item => item != null && item.Id == id);
        
        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }

        return Ok(new QueryResult<ResponsePost?>(200, "Запрос успешно выполнен", CreateResponsePostObject(post)));
    }
    
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<QueryResult<ResponsePost>>> Update(long communityId, long id, CreatePost model)
    {
        string? userId = GetUserIdFromJwtToken();
        
        if (userId == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        Community? community = await _context.Communities.Include("Posts").Where(item => item != null && item.Id == communityId).AsNoTracking().SingleOrDefaultAsync();
        
        if (community == null || community.OwnerId != userId)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post post = await CreateDbPostObject(communityId, model);
        
        if (!community.Posts.Any(item => item != null && item.Id == id) || id != post.Id)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }
        
        _context.Entry(post).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при обновлении поста", null));
        }
        
        return StatusCode(StatusCodes.Status201Created, new QueryResult<ResponsePost?>(200, "Пост успешно обновлён", CreateResponsePostObject(post)));
    }
    
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long communityId, long id)
    {
        string? userId = GetUserIdFromJwtToken();
        
        if (userId == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        Community? community = await _context.Communities.Include("Posts").Where(item => item != null && item.Id == communityId).AsNoTracking().SingleOrDefaultAsync();
        
        if (community == null || community.OwnerId != userId)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post post = community.Posts.Where(item => item.Id == id).FirstOrDefault();
        
        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }

        _context.Posts.Remove(post);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new QueryResult<string>(500, "Возникли ошибки при удалении поста", null));
        }

        return Ok(new QueryResult<string>(200, "Пост успешно удалено", null));
    }
    
    private string? GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId;
    }

    private ResponsePost CreateResponsePostObject(Post post)
    {
        ResponsePost responsePost = new ResponsePost()
        {
            Id = post.Id,
            Content = post.Content,
            Files = post.Files,
            Likes = post.Likes,
            Title = post.Title
        };

        return responsePost;
    }
    
    private async Task<Post> CreateDbPostObject(long communityId, CreatePost model)
    {
        Post post = new Post()
        {
            Id = model.Id,
            CommunityId = communityId,
            Content = model.Content,
            CreatedAt = DateTime.UtcNow,
            Files = model.Files,
            Likes = 0,
            Title = model.Title
        };

        return post;
    }
}