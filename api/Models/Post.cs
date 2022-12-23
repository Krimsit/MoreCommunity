using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

interface IPost
{
    long Id { get; set; }
    string Title { get; set; }
    string Content { get; set; }
}

public class Post : IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public string[] Likes { get; set; } = new string[] { };
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public long CommunityId { get; set; }
    [ForeignKey(("CommunityId"))] public virtual Community? Community { get; set; }
    public List<Comment> Comments { get; set; }
}

public class PostModel : IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
}

public class PostResponse : IPost
{
    public long Id { get; set; }
    public string Title { get; set; } = String.Empty;
    public string Content { get; set; } = String.Empty;
    public int Likes { get; set; } = 0;
    public bool IsMyLike { get; set; } = false;
    public long CommunityId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class LikePost
{
    public bool isMyLike { get; set; }
    public int count { get; set; }
}