using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

interface IPost
{
    long Id { get; set; }
    string Title { get; set; }
    string Content { get; set; }
    string[]? Files { get; set; }
}

public class Post : IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public string[]? Files { get; set; } = new string[] { };
    public int Likes { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    public long CommunityId { get; set; }
    [ForeignKey(("CommunityId"))]
    public virtual Community? Community { get; set; }
}

public class CreatePost: IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public string[]? Files { get; set; } = new string[] { };
}

public class ResponsePost: IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public string[]? Files { get; set; } = new string[] { };
    public int Likes { get; set; } = 0;
}