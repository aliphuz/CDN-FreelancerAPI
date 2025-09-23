using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Domain.Entities;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CDN.FreelancerAPI.Infrastructure.Repositories;

public class FreelancerRepository : IFreelancerRepository
{
    private readonly string _connectionString;

    public FreelancerRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task<Freelancer> CreateAsync(Freelancer freelancer)
    {
        using var connection = new SqlConnection(_connectionString);
        using var transaction = connection.BeginTransaction();

        try
        {
            var freelancerId = await connection.QuerySingleAsync<int>(
                "INSERT INTO Freelancers (Username, Email, Phone, IsArchived) OUTPUT INSERTED.Id VALUES (@Username, @Email, @Phone, @IsArchived)",
                freelancer, transaction);

            freelancer.Id = freelancerId;

            foreach (var skill in freelancer.Skillsets)
            {
                skill.FreelancerId = freelancerId;
                await connection.ExecuteAsync(
                    "INSERT INTO Skillsets (FreelancerId, SkillName) VALUES (@FreelancerId, @SkillName)",
                    skill, transaction);
            }

            foreach (var hobby in freelancer.Hobbies)
            {
                hobby.FreelancerId = freelancerId;
                await connection.ExecuteAsync(
                    "INSERT INTO Hobbies (FreelancerId, HobbyName) VALUES (@FreelancerId, @HobbyName)",
                    hobby, transaction);
            }

            transaction.Commit();
            return freelancer;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<Freelancer?> GetByIdAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var freelancer = await connection.QuerySingleOrDefaultAsync<Freelancer>(
            "SELECT * FROM Freelancers WHERE Id = @Id", new { Id = id });

        if (freelancer == null) return null;

        freelancer.Skillsets = (await connection.QueryAsync<Skillset>(
            "SELECT * FROM Skillsets WHERE FreelancerId = @Id", new { Id = id })).ToList();

        freelancer.Hobbies = (await connection.QueryAsync<Hobby>(
            "SELECT * FROM Hobbies WHERE FreelancerId = @Id", new { Id = id })).ToList();

        return freelancer;
    }

    public async Task<IEnumerable<Freelancer>> GetAllAsync(int page = 1, int pageSize = 10)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var offset = (page - 1) * pageSize;
        var freelancers = await connection.QueryAsync<Freelancer>(
            "SELECT * FROM Freelancers ORDER BY Id OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY",
            new { Offset = offset, PageSize = pageSize });

        foreach (var freelancer in freelancers)
        {
            freelancer.Skillsets = (await connection.QueryAsync<Skillset>(
                "SELECT * FROM Skillsets WHERE FreelancerId = @Id", new { Id = freelancer.Id })).ToList();

            freelancer.Hobbies = (await connection.QueryAsync<Hobby>(
                "SELECT * FROM Hobbies WHERE FreelancerId = @Id", new { Id = freelancer.Id })).ToList();
        }

        return freelancers;
    }

    public async Task<Freelancer> UpdateAsync(Freelancer freelancer)
    {
        using var connection = new SqlConnection(_connectionString);
        using var transaction = connection.BeginTransaction();

        try
        {
            await connection.ExecuteAsync(
                "UPDATE Freelancers SET Username = @Username, Email = @Email, Phone = @Phone WHERE Id = @Id",
                freelancer, transaction);

            await connection.ExecuteAsync(
                "DELETE FROM Skillsets WHERE FreelancerId = @Id", new { Id = freelancer.Id }, transaction);

            await connection.ExecuteAsync(
                "DELETE FROM Hobbies WHERE FreelancerId = @Id", new { Id = freelancer.Id }, transaction);

            foreach (var skill in freelancer.Skillsets)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO Skillsets (FreelancerId, SkillName) VALUES (@FreelancerId, @SkillName)",
                    skill, transaction);
            }

            foreach (var hobby in freelancer.Hobbies)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO Hobbies (FreelancerId, HobbyName) VALUES (@FreelancerId, @HobbyName)",
                    hobby, transaction);
            }

            transaction.Commit();
            return freelancer;
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task DeleteAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        using var transaction = connection.BeginTransaction();

        try
        {
            await connection.ExecuteAsync("DELETE FROM Skillsets WHERE FreelancerId = @Id", new { Id = id }, transaction);
            await connection.ExecuteAsync("DELETE FROM Hobbies WHERE FreelancerId = @Id", new { Id = id }, transaction);
            await connection.ExecuteAsync("DELETE FROM Freelancers WHERE Id = @Id", new { Id = id }, transaction);

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    public async Task<IEnumerable<Freelancer>> SearchAsync(string keyword)
    {
        using var connection = new SqlConnection(_connectionString);
        
        var freelancers = await connection.QueryAsync<Freelancer>(
            "SELECT * FROM Freelancers WHERE Username LIKE @Keyword OR Email LIKE @Keyword",
            new { Keyword = $"%{keyword}%" });

        foreach (var freelancer in freelancers)
        {
            freelancer.Skillsets = (await connection.QueryAsync<Skillset>(
                "SELECT * FROM Skillsets WHERE FreelancerId = @Id", new { Id = freelancer.Id })).ToList();

            freelancer.Hobbies = (await connection.QueryAsync<Hobby>(
                "SELECT * FROM Hobbies WHERE FreelancerId = @Id", new { Id = freelancer.Id })).ToList();
        }

        return freelancers;
    }

    public async Task ArchiveAsync(int id, bool archive)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.ExecuteAsync(
            "UPDATE Freelancers SET IsArchived = @IsArchived WHERE Id = @Id",
            new { Id = id, IsArchived = archive });
    }
}