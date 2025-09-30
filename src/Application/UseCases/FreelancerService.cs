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
        var freelancer = new Freelancer
        {
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone,
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

  

    public async Task<Freelancer> UpdateFreelancerAsync(int id, UpdateFreelancerDto dto)
    {
        var freelancer = new Freelancer
        {
            Id = id,
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone,
        };
        var updatedFreelancer = await _repository.UpdateAsync(freelancer);

        
        await _repository.AssignSkillsetsAsync(id, dto.SkillsetIds);
        await _repository.AssignHobbiesAsync(id, dto.HobbyIds);

        return await _repository.GetByIdAsync(id) ?? updatedFreelancer;
    }

    public async Task DeleteFreelancerAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }


    public async Task ArchiveFreelancerAsync(int id, bool archive)
    {
        await _repository.ArchiveAsync(id, archive);
    }
}