using FoodstoreApi.Web.ApiResponse;
using FoodstoreApi.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodstoreApi.Web.Controllers.Public;

[Route("api/public/combos")]
[ApiController]
public class PublicComboController : ControllerBase
{
    private readonly StoreDbContext _db;

    public PublicComboController(StoreDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetCombos(CancellationToken ct)
    {
        var combos = await _db.Combos
            .AsNoTracking()
            .Where(c => c.IsActive == true)
            .Include(c => c.ComboItems)
                .ThenInclude(ci => ci.MenuItem)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ComboDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ComboPrice = c.ComboPrice,
                ImageUrl = c.ImageUrl,
                Items = c.ComboItems.Select(ci => new ComboItemDto
                {
                    Name = ci.MenuItem.Name,
                    Quantity = ci.Quantity ?? 1
                }).ToList()
            })
            .ToListAsync(ct);

        return ApiResult.Success(combos);
    }
}

public class ComboDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal ComboPrice { get; set; }
    public string? ImageUrl { get; set; }
    public List<ComboItemDto> Items { get; set; } = new();
}

public class ComboItemDto
{
    public string Name { get; set; } = null!;
    public int Quantity { get; set; }
}
