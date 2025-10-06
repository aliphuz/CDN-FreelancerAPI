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
    public class SkillService
    {
        private readonly ISkillRepository _skillRepository;

        public SkillService (ISkillRepository skillRepository)
        {
            _skillRepository = skillRepository;
        }
        public async Task<IEnumerable<Skillset>> GetAllAsync()
        {
            return await _skillRepository.GetAllAsync();
        }

        public async Task<Skillset> CreateSkillAsync(CreateSkillDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Skill name is required");


            var existing = await _skillRepository.GetByNameAsync(dto.Name.Trim());
            if (existing != null)
                throw new InvalidOperationException("Skill already exists");

            var skill = new Skillset { SkillName = dto.Name.Trim() };
            await _skillRepository.AddAsync(skill);

            return skill;
        }
        public async Task DeleteSkill(int id)
        {
            await _skillRepository.DeleteAsync(id);
        }
    }
}
