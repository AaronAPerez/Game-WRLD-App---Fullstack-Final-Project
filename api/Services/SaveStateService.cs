using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

    public async Task<IEnumerable<SaveStateDTO>> GetAllSavesAsync()
{
    return await _context.GameSaves
        .Select(save => new SaveStateDTO
        {
            Id = save.Id,
            StateData = save.SaveState,  
        })
        .ToListAsync();
}

public async Task<SaveStateDTO?> SaveGameAsync(SaveStateDTO dto)
{
    var SaveState = new SaveStateModel  
    {
        SaveState = dto.StateData, 
    };

    _context.GameSaves.Add(SaveState);
    await _context.SaveChangesAsync();

    return new SaveStateDTO
    {
        Id = SaveState.Id,
        StateData = SaveState.SaveState, 
    };
}
    }
}