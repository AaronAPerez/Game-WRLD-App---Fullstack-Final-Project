using api.Models;
using api.Models.DTO;
using api.Services.Context;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class SaveStateService
    {
        private readonly DataContext _context;

        public SaveStateService(DataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SaveStateDTO>> GetAllSavesAsync(int userId)
        {
            // Fetch save states for a specific user
            return await _context.GameSaves
                .Where(save => save.UserId == userId) // Filter by UserId
                .Select(save => new SaveStateDTO
                {
                    Id = save.Id,
                    StateData = save.SaveState,
                    CreatedAt = save.CreatedAt,
                    UserId = save.UserId
                })
                .ToListAsync();
        }

        public async Task<SaveStateDTO?> SaveGameAsync(SaveStateDTO dto, int userId)
        {
            // Save the state with the userId
            var saveState = new SaveStateModel
            {
                SaveState = dto.StateData,
                UserId = userId // Associate with the user
            };

            _context.GameSaves.Add(saveState);
            await _context.SaveChangesAsync();

            return new SaveStateDTO
            {
                Id = saveState.Id,
                StateData = saveState.SaveState,
                CreatedAt = saveState.CreatedAt,
                UserId = saveState.UserId
            };
        }
    }
}
