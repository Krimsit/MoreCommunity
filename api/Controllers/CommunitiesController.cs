using api.Helpers;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CommunitiesController : ControllerBase
{
    private readonly DataContext _context;

    public CommunitiesController(DataContext context)
    {
        _context = context;
    }
    
    // Получить все сообщества
    [HttpGet]
    public async Task<ActionResult<QueryResult<List<Community>>>> GetAll()
    {
        List<Community> communities = await _context.Communities.ToListAsync();
        
        return Ok(new QueryResult<List<Community>>(200, "Запрос успешно выполнен", communities));
    }

    // Создать сообщество
    [HttpPost]
    public async Task<ActionResult<QueryResult<Community>>> Create(Community community)
    {
        _context.Communities.Add(community);
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return BadRequest(new QueryResult<string>(400, "Возникли ошибки при обновлении сообщества", ""));
        }
        
        return Ok(new QueryResult<Community>(200, "Запрос успешно выполнен", community));
    }
    
    // Получить сообщество по id
    [HttpGet("{id}")]
    public async Task<ActionResult<QueryResult<Community>>> GetById(long id)
    {
        Community community = await _context.Communities.FindAsync(id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", ""));
        }

        return Ok(new QueryResult<Community>(200, "Запрос успешно выполнен", community));
    }
    
    // Обновить конкретное сообщество
    [HttpPut("{id}")]
    public async Task<ActionResult<Community>> Update(long id, Models.Community community)
    {
        if (id != community.Id)
        {
            return BadRequest(new QueryResult<string>(400, "Возникли ошибки при обновлении сообщества", ""));
        }

        _context.Entry(community).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CommunityExists(id))
            {
                return NotFound(new QueryResult<string>(404, "Сообщество не найдено", ""));
            }
            else
            {
                throw;
            }
        }
        
        return Ok(new QueryResult<Community>(200, "Запрос успешно выполнен", community));
    }
    
    // Удалить конкретное сообщество
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        Models.Community community = await _context.Communities.FindAsync(id);

        if (community == null)
        {
            return NotFound(new QueryResult<string>(404, "Сообщество не найдено", ""));
        }

        _context.Communities.Remove(community);
        await _context.SaveChangesAsync();
        
        return Ok(new QueryResult<string>(200, "Сообщество успешно удалено", ""));
    }
    
    // Проверка существует ли сообщество в БД
    private bool CommunityExists(long id)
    {
        return _context.Communities.Any(item => item.Id == id);
    }
}