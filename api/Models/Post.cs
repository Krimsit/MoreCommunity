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
    public string[] Likes { get; set; } = new string[] { };
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
    public long CommunityId { get; set; }
    [ForeignKey(("CommunityId"))]
    public virtual Community? Community { get; set; }
    public List<Comment> Comments { get; set; }
}

public class PostModel: IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public string[]? Files { get; set; } = new string[] { };
}

public class PostResponse: IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public string[]? Files { get; set; } = new string[] { };
    public int Likes { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
}

public class PostAction<TDataType>
{
    public long Id { get; set; }
    public string Action { get; set; }
    public TDataType? Data { get; set; }
}