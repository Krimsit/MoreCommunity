using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CommunitiesController : Controller
{
    private readonly DataContext _context;

    public CommunitiesController(DataContext context)
    {
        _context = context;
    }
    
    // GET
    public async Task<ActionResult<List<Community>>> Index()
    {
        List<Community> communities = await _context.Communities.ToListAsync();
        
        return communities;
    }
}