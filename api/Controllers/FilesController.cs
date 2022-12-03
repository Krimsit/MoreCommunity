using System.Data.Common;
using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using api.Helpers;
using api.Models;

namespace api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
public class FilesController : ControllerBase
{
    private readonly Cloudinary _cloudinary = new Cloudinary("cloudinary://412489439386643:cd1oinqTtTA8OPGsLHGdea3brho@dwtd9mmad");
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    
    public FilesController(DataContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }
    
    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] CreateUpload model)
    {
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null && model.PostId != null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }
        
        _cloudinary.Api.Secure = true;
        
        byte[] destinationData;

        using(var ms = new MemoryStream())
        {
            await model.File.CopyToAsync(ms);
            destinationData = ms.ToArray();
        }
        
        UploadResult uploadResult;

        using(var ms = new MemoryStream(destinationData))
        {
            var uploadParams = new AutoUploadParams()
            {
                File = new FileDescription(model.File.FileName, ms),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true,
                Folder = model.Folder ?? ""
            };

            uploadResult = _cloudinary.Upload(uploadParams);
        }

        Upload file = new Upload()
        {
            Type = model.Type,
            Name = model.File.FileName,
            PostId = model.PostId ?? 0,
            Url = uploadResult?.Url.ToString() ?? "",
        };
        
        _context.Files.Add(file);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        return Ok(new QueryResult<Upload>(201, "Запрос успешно выполнен", file));
    }
    
    [NonAction]
    private string GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId ?? "";
    }
}