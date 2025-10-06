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
    public class HobbyRepository : IHobbyRepository
    {
        private readonly string _connectionString;
        public HobbyRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Hobby>> GetAllAsync()
        {
            using var conn = new SqlConnection(_connectionString);
            const string sql = "SELECT Id, HobbyName FROM HobbyOptions ORDER BY HobbyName";
            return await conn.QueryAsync<Hobby>(sql);
        }
        public async Task<Hobby?> GetByNameAsync(string hobbyName)
        {
            using var conn = new SqlConnection(_connectionString);
            const string sql = "SELECT TOP 1 Id, HobbyName FROM HobbyOptions WHERE LOWER(HobbyName) = LOWER(@HobbyName)";
            return await conn.QueryFirstOrDefaultAsync<Hobby>(sql, new { HobbyName = hobbyName.Trim() });
        }

        public async Task AddAsync(Hobby hobby)
        {
            using var conn = new SqlConnection(_connectionString);
            const string sql = "INSERT INTO HobbyOptions (HobbyName) VALUES (@HobbyName)";
            await conn.ExecuteAsync(sql, new { HobbyName = hobby.HobbyName.Trim() });
        }

        public async Task DeleteAsync(int id)
        {
            using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();

            try
            { 
                await conn.ExecuteAsync("DELETE FROM HobbyOptions WHERE Id = @Id", new { Id = id }, transaction);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        } 
    }
}
