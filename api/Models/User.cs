using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace api.Models;

public class UserRoles
{
    public const string Admin = "Admin";
    public const string User = "User";
}

public class User : IdentityUser
{
    public string Avatar { get; set; } = String.Empty;
    public long[] FollowedCommunities { get; set; } = new long[] { };
    public List<Community> MyCommunities { get; set; }
    public long[] LikedPosts { get; set; } = new long[] { };
}

public class RegisterModel
{
    public string Avatar { get; set; } = String.Empty;
    public string Username { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
} 

public class LoginModel
{
    public string Username { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
}

public class UserResponse
{
    public string Id { get; set; }
    public string Avatar { get; set; } = String.Empty;
    public string? Username { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
}

public class UpdateUser
{
    public string Avatar { get; set; } = String.Empty;
    public string? Username { get; set; } = String.Empty;
    public string? Email { get; set; } = String.Empty;
    public string? NewPassword { get; set; } = String.Empty;
} 