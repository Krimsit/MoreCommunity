﻿namespace api.Models;

public class UserRoles
{
    public const string Admin = "Admin";
    public const string User = "User";
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