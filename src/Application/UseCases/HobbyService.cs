using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDN.FreelancerAPI.Application.UseCases
{
    public class HobbyService
    {
        private readonly IHobbyRepository _repo;
        public HobbyService(IHobbyRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Hobby>> GetALlAsync()
        {
            return await _repo.GetAllAsync();
        }
        public async Task<Hobby> CreateHobbyAsync(CreateHobbyDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Hobby name or description is required");

            
            var existing = await _repo.GetByNameAsync(dto.Name.Trim());
            if (existing != null)
                throw new InvalidOperationException("Hobby already exists");

            var hobby = new Hobby { HobbyName = dto.Name.Trim(), HobbyDescription = dto.HobbyDescription.Trim() };
            await _repo.AddAsync(hobby);

            return hobby;
        }

        public async Task DeleteHobby (int id)
        {
            await _repo.DeleteAsync(id);
        }
    }
}
