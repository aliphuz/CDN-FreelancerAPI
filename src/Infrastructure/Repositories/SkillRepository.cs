using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Domain.Entities;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDN.FreelancerAPI.Infrastructure.Repositories
{
    public class SkillRepository : ISkillRepository
    {
        private readonly string _connectionString;

        public SkillRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Skillset>> GetAllAsync()
        {
            using var conn = new SqlConnection(_connectionString);
            const string sql = "SELECT Id, SkillName, SkillDescription FROM SkillSetOptions ORDER BY SkillName";
            return await conn.QueryAsync<Skillset>(sql);
        }
        public async Task<Skillset?> GetByNameAsync(string skillName)
        {
            using var conn = new SqlConnection(_connectionString);
            const string sql = "SELECT TOP 1 Id, SkillName FROM SkillSetOptions WHERE LOWER(SkillName) = LOWER(@SkillName)";
            return await conn.QueryFirstOrDefaultAsync<Skillset>(sql, new { SkillName = skillName.Trim() });
        }

        public async Task AddAsync(Skillset skill)
        {
            using var conn = new SqlConnection(_connectionString);
            const string sql = "INSERT INTO SkillSetOptions (SkillName, SkillDescription) VALUES (@SkillName, @SkillDescription)";
            await conn.ExecuteAsync(sql, new { SkillName = skill.SkillName.Trim(), SkillDescription = skill.SkillDescription.Trim() });
        }
        public async Task DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            {
                await conn.ExecuteAsync("DELETE FROM SkillSetOptions WHERE Id = @Id", new { Id = id }, transaction); 

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
        public async Task<Skillset?> GetByIdAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            var query = "SELECT * FROM SkillsetOptions WHERE Id = @Id";
            return await conn.QueryFirstOrDefaultAsync<Skillset>(query, new { Id = id });

        }

        public async Task UpdateAsync (Skillset skill)
        {
            using var conn = new SqlConnection(_connectionString);
            var query = "UPDATE SkillsetOptions SET SkillName =@SkillName, SkillDescription = @SkillDescription WHERE Id =@Id";
            await conn.ExecuteAsync(query, skill);
        }
    }
}
