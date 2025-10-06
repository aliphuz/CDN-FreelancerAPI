using CDN.FreelancerAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDN.FreelancerAPI.Application.Interfaces
{
    public interface IHobbyRepository
    {
        Task<IEnumerable<Hobby>> GetAllAsync();
        Task<Hobby?> GetByNameAsync(string name);
        Task AddAsync(Hobby hobby);
        Task DeleteAsync(int id);

    }
}
