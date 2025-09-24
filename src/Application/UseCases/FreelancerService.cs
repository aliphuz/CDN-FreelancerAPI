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
        var freelancer = new Freelancer
        {
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone,
            Skillsets = dto.Skillsets.Select(s => new Skillset { SkillName = s }).ToList(),
            Hobbies = dto.Hobbies.Select(h => new Hobby { HobbyName = h }).ToList()
        };

        return await _repository.CreateAsync(freelancer);
    }

    public async Task<Freelancer?> GetFreelancerByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<IEnumerable<Freelancer>> GetFreelancersPagedAsync(int page = 1, int pageSize = 10)
    {
        return await _repository.GetAllAsync(page, pageSize);
    }

    public async Task<IEnumerable<Freelancer>> GetAllFreelancersAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Freelancer> UpdateFreelancerAsync(int id, UpdateFreelancerDto dto)
    {
        var freelancer = new Freelancer
        {
            Id = id,
            Username = dto.Username,
            Email = dto.Email,
            Phone = dto.Phone,
            Skillsets = dto.Skillsets.Select(s => new Skillset { SkillName = s, FreelancerId = id }).ToList(),
            Hobbies = dto.Hobbies.Select(h => new Hobby { HobbyName = h, FreelancerId = id }).ToList()
        };

        return await _repository.UpdateAsync(freelancer);
    }

    public async Task DeleteFreelancerAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }

    public async Task<IEnumerable<Freelancer>> SearchFreelancersAsync(string keyword)
    {
        return await _repository.SearchAsync(keyword);
    }

    public async Task ArchiveFreelancerAsync(int id, bool archive)
    {
        await _repository.ArchiveAsync(id, archive);
    }
}