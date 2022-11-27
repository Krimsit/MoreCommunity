using Microsoft.AspNetCore.Identity;

namespace api.Models;

public class UserRoles
{
    public const string Admin = "Admin";
    public const string User = "User";
}

public class User : IdentityUser
{
    public long[] FollowedCommunities { get; set; } = new long[] { };
    public List<Community> MyCommunities { get; set; }
    public long[] LikedPosts { get; set; } = new long[] { };
}

public class RegisterModel
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
} 

public class LoginModel
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}

public class Response
{
    public string? Status { get; set; }
    public string? Message { get; set; }
}