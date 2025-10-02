using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Domain.Entities;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDN.FreelancerAPI.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;
        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM Users WHERE Email = @Email";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
        }

        public async Task<int> CreateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = @"
            INSERT INTO Users (Username, Email, PasswordHash, Role)
            VALUES (@Username, @Email, @PasswordHash, @Role);
            SELECT CAST(SCOPE_IDENTITY() AS int);
        ";
            var id = await connection.QuerySingleAsync<int>(sql, new
            {
                user.username,
                user.Email,
                user.PasswordHash,
                user.Role
            });
            user.Id = id;
            return id;
        }
        public async Task UpdateRefreshTokenAsync(int userId, string refreshToken, DateTime expiry)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "UPDATE Users SET RefreshToken = @RefreshToken, RefreshTokenExpiryTime = @Expiry WHERE Id = @UserId";
            await connection.ExecuteAsync(sql, new { UserId = userId, RefreshToken = refreshToken, Expiry = expiry });
        }

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        {
            using var connection = new SqlConnection(_connectionString);
            var sql = "SELECT * FROM Users WHERE RefreshToken = @RefreshToken AND RefreshTokenExpiryTime > GETUTCDATE()";
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { RefreshToken = refreshToken });
        }

    }
}
