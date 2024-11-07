using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using api.Models.DTO;
using api.Services;

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


        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaveStateDTO>>> GetAllSaveStates()
        {
            var saves = await _saveStateService.GetAllSavesAsync();
            return Ok(saves);
        }

        [HttpPost]
        public async Task<ActionResult<SaveStateDTO>> SaveGameState(SaveStateDTO dto)
        {
            var savedState = await _saveStateService.SaveGameAsync(dto);
            if (savedState == null)
            {
                return BadRequest("Failed to save the game state.");
            }

            return CreatedAtAction(nameof(GetAllSaveStates), new { id = savedState.Id }, savedState);
        }
    }
}
