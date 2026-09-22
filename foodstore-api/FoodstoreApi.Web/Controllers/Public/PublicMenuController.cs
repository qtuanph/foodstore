using FoodstoreApi.Web.ApiResponse;
using FoodstoreApi.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodstoreApi.Web.Controllers.Public;

[Route("api/public/menu")]
[ApiController]
public class PublicMenuController : ControllerBase
{
    private readonly StoreDbContext _db;

    public PublicMenuController(StoreDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetMenu(CancellationToken ct)
    {
        var categories = await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new MenuCategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Items = c.MenuItems
                    .Where(m => m.IsActive == true)
                    .OrderBy(m => m.Name)
                    .Select(m => new MenuItemDto
                    {
                        Id = m.Id,
                        Name = m.Name,
                        Description = m.Description,
                        Price = m.Price,
                        ImageUrl = m.ImageUrl
                    }).ToList()
            })
            .Where(c => c.Items.Any())
            .ToListAsync(ct);

        return ApiResult.Success(categories);
    }
}

public class MenuCategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public List<MenuItemDto> Items { get; set; } = new();
}

public class MenuItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
}
