using System.Security.Claims;
using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[Route("api/communities/{communityId}/posts/{postId}/comments")]
[Produces("application/json")]
public class CommentController : ControllerBase
{
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    
    public CommentController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<CommentResponse>>> GetAll(long communityId, long postId)
    {
        Community community = await _context.Communities.Include("Posts")
            .Where(item => item != null && item.Id == communityId).FirstOrDefaultAsync();
        
        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }
        
        Post? post = await _context.Posts.Include("Comments").Where(item => item != null && item.Id == postId && item.CommunityId == communityId).FirstOrDefaultAsync();
        
        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }
        
        IOrderedEnumerable<Comment> comments = post.Comments.OrderBy(item => item!.CreatedAt)!;
        List<CommentResponse> commentResponses = new List<CommentResponse>();

        foreach (Comment comment in comments)
        {
            commentResponses.Add(CreateResponseObject(comment));
        }
        
        return Ok(new QueryResult<List<CommentResponse>>(200, "Запрос успешно выполнен", commentResponses));
    }
    
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<QueryResult<CommentResponse>>> Create(long communityId, long postId, [FromBody] CommentModel model)
    {
        string? userId = GetUserIdFromJwtToken();

        if (userId == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        Community community = await _context.Communities.Include("Posts")
            .Where(item => item != null && item.Id == communityId).FirstOrDefaultAsync();

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти сообщество", null));
        }
        
        Post? post = await _context.Posts.Include("Comments").Where(item => item != null && item.Id == postId && item.CommunityId == communityId).FirstOrDefaultAsync();
        
        if (post == null)
        {
            return NotFound(new QueryResult<string>(404, "Не удалось найти пост", null));
        }

        Comment comment = CreateDbObject(postId, user, model);

        _context.Comments.Add(comment);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при создании комментария", null));
        }

        return StatusCode(StatusCodes.Status201Created,
            new QueryResult<CommentResponse?>(200, "Комментарий успешно создан", CreateResponseObject(comment)));
    }
    
    private string? GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId;
    }

    public CommentResponse CreateResponseObject(Comment comment)
    {
        CommentResponse commentResponse = new CommentResponse()
        {
            Id = comment.Id,
            Username = comment.Username,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        };

        return commentResponse;
    }

    public Comment CreateDbObject(long postId, User user, CommentModel model)
    {
        Comment comment = new Comment()
        {
            Id = model.Id,
            Username = user.UserName,
            PostId = postId,
            Content = model.Content,
            CreatedAt = DateTime.UtcNow,
        };

        return comment;
    }
}