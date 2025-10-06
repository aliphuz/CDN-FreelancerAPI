using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Domain.Entities;

namespace CDN.FreelancerAPI.Application.UseCases;

public class FreelancerService
{
    private readonly IFreelancerRepository _repository;

    public FreelancerService(IFreelancerRepository repository)
    {
        _repository = repository;
    }

    public async Task<Freelancer> CreateFreelancerAsync(CreateFreelancerDto dto)
    {

        if (await _repository.IsEmailExistAsync(dto.Email))
            throw new Exception("Email already exists.");

        var existingFreelancer = await _repository.GetByUserIdAsync(dto.UserId);
        if (existingFreelancer != null)
        {
            throw new InvalidOperationException("Each user only have one freelancer profile");
        }

        var freelancer = new Freelancer
        {
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone,
            UserId = dto.UserId,
            IsArchived = false
        };
        var createdFreelancer = await _repository.CreateAsync(freelancer);

        
        await _repository.AssignSkillsetsAsync(createdFreelancer.Id, dto.SkillsetIds);
        await _repository.AssignHobbiesAsync(createdFreelancer.Id, dto.HobbyIds);

        return await _repository.GetByIdAsync(createdFreelancer.Id) ?? createdFreelancer;
    }

    public async Task<IEnumerable<SkillsetOptions>> GetSkillOptionsAsync()
    {
        return await _repository.GetSkillOptionsAsync();
    }

    public async Task<IEnumerable<HobbyOptions>> GetHobbyOptionsAsync()
    {
        return await _repository.GetHobbyOptionsAsync();
    }



    public async Task<Freelancer?> GetFreelancerByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Freelancer>> GetFreelancersPagedAsync(int pageNumber, int pageSize, string? keyword = null)
    {
        return await _repository.GetAllAsync(pageNumber, pageSize,keyword);
    }

  

    public async Task<Freelancer> UpdateFreelancerAsync(int id, UpdateFreelancerDto dto, int userId, string userRole)
    {
        var freelancer = await _repository.GetByIdAsync(id)
        ?? throw new KeyNotFoundException("Freelancer not found.");

        if (userRole == "User" && freelancer.UserId != userId)
            throw new UnauthorizedAccessException("You can only update your own freelancer profile.");

        freelancer.Username = dto.Username ?? freelancer.Username;
        freelancer.Email = dto.Email ?? freelancer.Email;
        freelancer.Phone = dto.Phone ?? freelancer.Phone;

        var updatedFreelancer = await _repository.UpdateAsync(freelancer);

        
        await _repository.AssignSkillsetsAsync(id, dto.SkillsetIds);
        await _repository.AssignHobbiesAsync(id, dto.HobbyIds);

        return await _repository.GetByIdAsync(id) ?? updatedFreelancer;
    }

    public async Task DeleteFreelancerAsync(int id,int userId, string userRole)
    {
        var freelancer = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Freelancer not found.");

        if (userRole == "User" && freelancer.UserId != userId)
            throw new UnauthorizedAccessException("You can only delete your own freelancer profile.");
        await _repository.DeleteAsync(id);
    }


    public async Task ArchiveFreelancerAsync(int id, bool archive, int userId, string userRole)
    {
        var freelancer = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Freelancer not found.");

        if (userRole == "User" && freelancer.UserId != userId)
            throw new UnauthorizedAccessException("You can only archive your own freelancer profile.");

        await _repository.ArchiveAsync(id, archive);
    }
    public async Task<bool> IsOwnerAsync(int freelancerId, int userId)
    {
        var freelancer = await _repository.GetByIdAsync(freelancerId);
        return freelancer != null && freelancer.UserId == userId;
    }
}