using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

interface IComment
{
    long Id { get; set; }
    string Content { get; set; }
}

public class Comment: IComment
{
    public long Id { get; set; }
    public string Avatar { get; set; } = String.Empty;
    public string Username { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    public long PostId { get; set; }
    [ForeignKey(("PostId"))]
    public virtual Post? Post { get; set; }
}

public class CommentModel : IComment
{
    public long Id { get; set; }
    public string Content { get; set; } = String.Empty;
}

public class CommentResponse : IComment
{
    public long Id { get; set; }
    public string Avatar { get; set; } = String.Empty;
    public string? Username { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
}