using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

interface ICommunity
{
    long Id { get; set; }
    string Avatar { get; set; }
    string? Banner { get; set; }
    string Name { get; set; }
    string Description { get; set; }
    string[] Keywords { get; set; }
}

public class Community : ICommunity
{
    public long Id { get; set; }
    public string Avatar { get; set; } = String.Empty;
    public string? Banner { get; set; } = String.Empty;
    public string Name { get; set; } = String.Empty;
    public string Description { get; set; } = String.Empty;
    public string[] Followers { get; set; } = new string[] { };
    public string[] Keywords { get; set; } = new string[] { };
    public string StreamId { get; set; } = String.Empty;
    public string OwnerId { get; set; }
    [ForeignKey(("OwnerId"))] public User User { get; set; }
    public List<Post?> Posts { get; set; }
}

public class CreateCommunity : ICommunity
{
    public long Id { get; set; }
    public string Avatar { get; set; } = String.Empty;
    public string? Banner { get; set; } = String.Empty;
    public string Name { get; set; } = String.Empty;
    public string Description { get; set; } = String.Empty;
    public string[] Keywords { get; set; } = new string[] { };
}

public class ResponseCommunity : ICommunity
{
    public long Id { get; set; }
    public string Avatar { get; set; } = String.Empty;

    public string? Banner { get; set; } = String.Empty;
    public string Name { get; set; } = String.Empty;
    public string Description { get; set; } = String.Empty;
    public int Followers { get; set; } = 0;
    public string[] Keywords { get; set; } = new string[] { };
    public bool isOwner { get; set; } = false;
    public bool isMyFollow { get; set; } = false;
    public string StreamId { get; set; } = String.Empty;
}

public class FollowCommunity
{
    public bool isMyFollow { get; set; }
    public int count { get; set; }
}