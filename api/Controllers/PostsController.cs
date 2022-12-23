using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Helpers;
using api.Models;

namespace api.Controllers;

[Route("api/communities/{communityId}/[controller]")]
[Produces("application/json")]
public class PostsController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private GetResponseObject _getResponseObject = new GetResponseObject();

    public PostsController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<List<PostResponse>>> GetAll(long communityId)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        Community? community = await _context.Communities.Include("Posts")
            .Where(item => item.Id == communityId).FirstOrDefaultAsync();

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        IOrderedEnumerable<Post> posts = community.Posts.OrderBy(item => item!.CreatedAt)!;

        List<PostResponse> postResponses = new List<PostResponse>();

        foreach (Post post in posts)
        {
            postResponses.Add(_getResponseObject.Post(post, user));
        }

        return Ok(new QueryResult<List<PostResponse>>(200, "Запрос успешно выполнен", postResponses));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<QueryResult<PostResponse>>> Create(long communityId, [FromBody] PostModel model)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community? community = await _context.Communities.FindAsync(communityId);

        if (community == null || community.OwnerId != user.Id)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post post = new Post()
        {
            Id = model.Id,
            CommunityId = communityId,
            Content = model.Content,
            CreatedAt = DateTime.UtcNow,
            Likes = new string[] { },
            Title = model.Title
        };

        _context.Posts.Add(post);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при создании поста", null));
        }

        return StatusCode(StatusCodes.Status201Created,
            new QueryResult<PostResponse?>(200, "Пост успешно создан", _getResponseObject.Post(post, user)));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QueryResult<PostResponse>>> GetById(long communityId, long id)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        Community? community = await _context.Communities.Include("Posts")
            .Where(item => item.Id == communityId).FirstOrDefaultAsync();

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post? post = community.Posts.FirstOrDefault(item => item != null && item.Id == id);

        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }

        return Ok(new QueryResult<PostResponse?>(200, "Запрос успешно выполнен", _getResponseObject.Post(post, user)));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<QueryResult<PostResponse>>> Update(long communityId, long id,
        [FromBody] PostModel model)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community? community = await _context.Communities.Include("Posts")
            .Where(item => item.Id == communityId).AsNoTracking().SingleOrDefaultAsync();

        if (community == null || community.OwnerId != userId)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post? post = community.Posts.FirstOrDefault(item => item != null && item.Id == id);

        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }

        post.Title = model.Title;
        post.Content = model.Content;

        _context.Entry(post).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении поста", null));
        }

        return StatusCode(StatusCodes.Status201Created,
            new QueryResult<PostResponse>(200, "Пост успешно обновлён", _getResponseObject.Post(post, user)));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long communityId, long id)
    {
        string userId = GetUserIdFromJwtToken();

        if (userId == "")
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community? community = await _context.Communities.Include("Posts")
            .Where(item => item.Id == communityId).AsNoTracking().SingleOrDefaultAsync();

        if (community == null || community.OwnerId != userId)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post? post = community.Posts.Where(item => item != null && item.Id == id).FirstOrDefault();

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
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при удалении поста", null));
        }

        return Ok(new QueryResult<bool>(200, "Пост успешно удалено", true));
    }

    [Authorize]
    [HttpPost("{id}/like")]
    public async Task<ActionResult<int>> Like(long communityId, long id)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community? community = await _context.Communities.Include("Posts")
            .Where(item => item.Id == communityId).AsNoTracking().SingleOrDefaultAsync();

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post? post = community.Posts.FirstOrDefault(item => item != null && item.Id == id);

        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }

        bool isMyLike;

        if (post.Likes.Contains(userId))
        {
            post.Likes = post.Likes.Where(item => item != user.Id).ToArray();
            user.LikedPosts = user.LikedPosts.Where(item => item != post.Id).ToArray();
            isMyLike = false;
        }
        else
        {
            post.Likes = post.Likes.Append(user.Id).ToArray();
            user.LikedPosts = user.LikedPosts.Append(post.Id).ToArray();
            isMyLike = true;
        }

        _context.Entry(post).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
            await _userManager.UpdateAsync(user);
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при лайке поста", null));
        }

        return Ok(new QueryResult<LikePost>(200, "Запрос успешно выполнен",
            new LikePost() { isMyLike = isMyLike, count = post.Likes.Length }));
    }

    [HttpGet("{id}/files")]
    public async Task<ActionResult<QueryResult<PostResponse>>> GetFiles(long communityId, long id)
    {
        Community? community = await _context.Communities.Include("Posts")
            .Where(item => item.Id == communityId).FirstOrDefaultAsync();

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }

        Post? post = community.Posts.FirstOrDefault(item => item != null && item.Id == id);

        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }

        List<Upload> files = _context.Files.Where(item => item.PostId == post.Id).ToList();

        return Ok(new QueryResult<List<Upload>>(200, "Запрос успешно выполнен", files));
    }

    [NonAction]
    private string GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId ?? "";
    }
}