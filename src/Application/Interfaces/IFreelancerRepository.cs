using CDN.FreelancerAPI.Domain.Entities;

namespace CDN.FreelancerAPI.Application.Interfaces;

public interface IFreelancerRepository
{
    Task<Freelancer> CreateAsync(Freelancer freelancer);
    Task<Freelancer?> GetByIdAsync(int id);
    
    Task<IEnumerable<Freelancer>> GetAllAsync(int pageNumber, int pageSize, string keyword);
    Task<Freelancer> UpdateAsync(Freelancer freelancer);
    Task DeleteAsync(int id);
    
    Task ArchiveAsync(int id, bool archive);
    Task AssignSkillsetsAsync(int freelancerId, List<int> skillsetIds);
    Task AssignHobbiesAsync(int freelancerId, List<int> hobbyIds);
    Task<IEnumerable<SkillsetOptions>> GetSkillOptionsAsync();
    Task<IEnumerable<HobbyOptions>> GetHobbyOptionsAsync();
}