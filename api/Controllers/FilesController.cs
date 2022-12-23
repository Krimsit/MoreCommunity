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

        if (user == null)
        {
            return StatusCode(StatusCodes.Status401Unauthorized,
                new QueryResult<string>(401, "Возникли проблемы с авторизацией. Попробуйте перезайти", null));
        }

        _cloudinary.Api.Secure = true;

        UploadResult uploadResult;

        var uploadParams = new AutoUploadParams()
        {
            File = new FileDescription(model.File.FileName, GetFileByteArray(model.File)),
            UseFilename = true,
            UniqueFilename = false,
            Overwrite = true,
            Folder = model.Folder ?? ""
        };

        uploadResult = _cloudinary.Upload(uploadParams);

        Upload file = new Upload()
        {
            Type = model.Type,
            Name = model.File.FileName,
            PostId = model.PostId ?? 0,
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
    
    [HttpPost("/post")]
    public async Task<IActionResult> UploadPostFiles([FromForm] UploadPostFiles model)
    {
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
            
            await _cloudinary.DeleteFolderAsync(model.Folder);
        }
        
        // _cloudinary.Api.Secure = true;
        //
        // UploadResult uploadResult;
        //
        // var uploadParams = new AutoUploadParams()
        // {
        //     File = new FileDescription(model.File.FileName, GetFileByteArray(model.File)),
        //     UseFilename = true,
        //     UniqueFilename = false,
        //     Overwrite = true,
        //     Folder = model.Folder ?? ""
        // };
        //
        // uploadResult = _cloudinary.UploadAsync(uploadParams);
        //
        // Upload file = new Upload()
        // {
        //     Type = model.Type,
        //     Name = model.File.FileName,
        //     PostId = model.PostId ?? 0,
        //     Url = uploadResult?.Url.ToString() ?? "",
        // };
        //
        // await _context.Files.AddAsync(file);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbException)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new QueryResult<string>(500, "Возникли ошибки при обновлении сообщества", null));
        }

        return Ok(new QueryResult<Upload>(201, "Запрос успешно выполнен", null));
    }
    
    [NonAction]
    private string GetUserIdFromJwtToken()
    {
        ClaimsIdentity? claimsIdentity = this.User.Identity as ClaimsIdentity;
        string? userId = claimsIdentity?.FindFirst(ClaimTypes.Name)?.Value;

        return userId ?? "";
    }

    [NonAction]
    private MemoryStream GetFileByteArray(IFormFile file)
    {
        byte[] destinationData;

        using(MemoryStream ms = new MemoryStream())
        {
            file.CopyToAsync(ms);
            destinationData = ms.ToArray();
        }

        using(var ms = new MemoryStream(destinationData))
        {
            return ms;
        }
    }
}