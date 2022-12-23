using System.Data.Common;
using System.Security.Claims;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using api.Helpers;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
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
    public async Task<IActionResult> Upload([FromBody] CreateUpload model)
    {
        _cloudinary.Api.Secure = true;

        UploadResult uploadResult;

        var uploadParams = new AutoUploadParams()
        {
            File = new FileDescription(model.Name, model.File),
            UseFilename = true,
            UniqueFilename = false,
            Overwrite = true,
            Folder = model.Folder ?? ""
        };

        uploadResult = _cloudinary.Upload(uploadParams);

        Upload file = new Upload()
        {
            Type = model.Type,
            Name = model.Name,
            Url = uploadResult?.Url.ToString() ?? "",
        };
        
        await _context.Files.AddAsync(file);

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
    
    [Authorize]
    [HttpPost("post")]
    public async Task<IActionResult> UploadPostFiles([FromBody] UploadPostFiles model)
    {
        _cloudinary.Api.Secure = true;
        
        string userId = GetUserIdFromJwtToken();
        User? user = await _userManager.FindByIdAsync(userId);

        if (user == null && model.PostId != null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        if (model.PostId != null)
        {
            List<Upload> postFiles = await _context.Files.Where(item => item.PostId == model.PostId).ToListAsync();

            foreach (Upload postFile in postFiles)
            {
                _context.Files.Remove(postFile);
            }
            
            _cloudinary.DeleteFolder(model.Folder);
        }

        foreach (UploadPostFile uploadedFile in model.files)
        {
            UploadResult uploadResult;

            var uploadParams = new AutoUploadParams()
            {
                File = new FileDescription(uploadedFile.Name, uploadedFile.File),
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = true,
                Folder = model.Folder ?? ""
            };

            uploadResult = _cloudinary.Upload(uploadParams);

            Upload file = new Upload()
            {
                Type = uploadedFile.Type,
                Name = uploadedFile.Name,
                PostId = model.PostId,
                Url = uploadResult?.Url.ToString() ?? "",
            };
        
            await _context.Files.AddAsync(file);
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        return Ok(new QueryResult<bool>(201, "Запрос успешно выполнен", true));
    }
    
    [NonAction]
    private string GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId ?? "";
    }
}