using CDN.FreelancerAPI.Domain.Entities;

namespace CDN.FreelancerAPI.Application.Interfaces;

public interface IFreelancerRepository
{
    Task<Freelancer> CreateAsync(Freelancer freelancer);
    Task<Freelancer?> GetByIdAsync(int id);
    Task<IEnumerable<Freelancer>> GetAllAsync();
    Task<IEnumerable<Freelancer>> GetAllAsync(int pageNumber, int pageSize);
    Task<Freelancer> UpdateAsync(Freelancer freelancer);
    Task DeleteAsync(int id);
    Task<IEnumerable<Freelancer>> SearchAsync(string keyword);
    Task ArchiveAsync(int id, bool archive);
}