using System.Security.Claims;
using api.Models.DTO;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SaveStateController : ControllerBase
    {
        private readonly SaveStateService _saveStateService;

        public SaveStateController(SaveStateService saveStateService)
        {
            _saveStateService = saveStateService;
        }

        [HttpGet("GetAllSaves")]
        public async Task<IActionResult> GetAllSaves()
        {
            var userId = GetUserIdFromClaims();

            var saveStates = await _saveStateService.GetAllSavesAsync(userId);
            return Ok(saveStates);
        }

        [HttpPost("SaveGame")]
        public async Task<IActionResult> SaveGame([FromBody] SaveStateDTO saveStateDTO)
        {
            var userId = GetUserIdFromClaims();
            var savedState = await _saveStateService.SaveGameAsync(saveStateDTO, userId);
            return Ok(savedState);
        }

        private int GetUserIdFromClaims()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("User not authenticated.");
        }
    }
}
