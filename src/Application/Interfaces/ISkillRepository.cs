using CDN.FreelancerAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDN.FreelancerAPI.Application.Interfaces
{
    public interface ISkillRepository
    {
        Task<IEnumerable<Skillset>> GetAllAsync();
        Task<Skillset?> GetByNameAsync(string name);
        Task AddAsync(Skillset skillset);
        Task DeleteAsync(int id);
    }
}
