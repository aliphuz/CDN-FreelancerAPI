using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Domain.Entities;
using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

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
        await connection.OpenAsync();
        using var transaction = connection.BeginTransaction();

        try
        {
            var freelancerId = await connection.QuerySingleAsync<int>(
                "INSERT INTO Freelancers (UserId, Username, Email, Phone, IsArchived) OUTPUT INSERTED.Id VALUES (@UserID, @Username, @Email, @Phone, @IsArchived)",
                freelancer, transaction);

            freelancer.Id = freelancerId;

            foreach (var skill in freelancer.Skillsets)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO FreelancerSkillsets (FreelancerId, SkillsetOptionId) VALUES (@FreelancerId, @SkillsetOptionId)",
                    new { FreelancerId = freelancerId, SkillsetOptionId = skill.Id }, transaction);
            }

            
            foreach (var hobby in freelancer.Hobbies)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO FreelancerHobbies (FreelancerId, HobbyOptionId) VALUES (@FreelancerId, @HobbyOptionId)",
                    new { FreelancerId = freelancerId, HobbyOptionId = hobby.Id }, transaction);
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
    public async Task<Freelancer?> GetByUserIdAsync(int userId)
    {
        using var connectionn = new SqlConnection(_connectionString);
        await connectionn.OpenAsync();

        return await connectionn.QuerySingleOrDefaultAsync<Freelancer>(
            "SELECT * FROM Freelancers WHERE UserID = @UserId", new { UserId = userId });
    }

    public async Task<bool> IsEmailExistAsync(string email)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        var count = await connection.QuerySingleAsync<int>(
            "SELECT COUNT(1) FROM Freelancers WHERE Email = @Email",
            new { Email = email });

        return count > 0;
    }

    public async Task AssignSkillsetsAsync(int freelancerId, List<int> skillsetIds)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        foreach (var skillId in skillsetIds)
        {
            await connection.ExecuteAsync(
                "INSERT INTO FreelancerSkillsets (FreelancerId, SkillsetOptionId) VALUES (@FreelancerId, @SkillId)",
                new { FreelancerId = freelancerId, SkillId = skillId });
        }
    }

    public async Task AssignHobbiesAsync(int freelancerId, List<int> hobbyIds)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

        foreach (var hobbyId in hobbyIds)
        {
            await connection.ExecuteAsync(
                "INSERT INTO FreelancerHobbies (FreelancerId, HobbyOptionId) VALUES (@FreelancerId, @HobbyId)",
                new { FreelancerId = freelancerId, HobbyId = hobbyId });
        }
    }

    public async Task<IEnumerable<HobbyOptions>> GetHobbyOptionsAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<HobbyOptions>("SELECT * FROM HobbyOptions");
    }

    public async Task<IEnumerable<SkillsetOptions>> GetSkillOptionsAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<SkillsetOptions>("SELECT * FROM SkillsetOptions");
    }

    public async Task<Freelancer?> GetByIdAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();

       
        var freelancer = await connection.QuerySingleOrDefaultAsync<Freelancer>(
            "SELECT * FROM Freelancers WHERE Id = @Id", new { Id = id });

        if (freelancer == null) return null;

        
        var skillsets = await connection.QueryAsync<SkillsetOptions>(
            @"SELECT so.Id, so.SkillName
          FROM FreelancerSkillsets fs
          INNER JOIN SkillsetOptions so ON fs.SkillsetOptionId = so.Id
          WHERE fs.FreelancerId = @Id",
            new { Id = id });
        freelancer.Skillsets = skillsets.ToList();

        var hobbies = await connection.QueryAsync<HobbyOptions>(
            @"SELECT ho.Id, ho.HobbyName
          FROM FreelancerHobbies fh
          INNER JOIN HobbyOptions ho ON fh.HobbyOptionId = ho.Id
          WHERE fh.FreelancerId = @Id",
            new { Id = id });
        freelancer.Hobbies = hobbies.ToList();

        return freelancer;
    }


    public async Task<IEnumerable<Freelancer>> GetAllAsync(int page = 1, int pageSize = 10, string? keyword = null)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        
        var offset = (page - 1) * pageSize;
        var freelancers = await connection.QueryAsync<Freelancer>(
            "SELECT * FROM Freelancers WHERE(@Keyword IS NULL OR Username LIKE '%' + @Keyword + '%' OR Email LIKE '%' + @Keyword + '%') ORDER BY Id OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY; ",
            new {Keyword = string.IsNullOrWhiteSpace(keyword) ? null : keyword, Offset = offset, PageSize = pageSize});

        foreach (var freelancer in freelancers)
        {
            var skillsets = await connection.QueryAsync<SkillsetOptions>(
            @"SELECT so.Id, so.SkillName, so.SkillDescription
              FROM FreelancerSkillsets fs
              INNER JOIN SkillsetOptions so ON fs.SkillsetOptionId = so.Id
              WHERE fs.FreelancerId = @Id",
            new { Id = freelancer.Id });
            freelancer.Skillsets = skillsets.ToList();
            var hobbies = await connection.QueryAsync<HobbyOptions>(
             @"SELECT ho.Id, ho.HobbyName, ho.HobbyDescription
              FROM FreelancerHobbies fh
              INNER JOIN HobbyOptions ho ON fh.HobbyOptionId = ho.Id
              WHERE fh.FreelancerId = @Id",
             new { Id = freelancer.Id });
            freelancer.Hobbies = hobbies.ToList();
        }

        return freelancers;
    }



    public async Task<Freelancer> UpdateAsync(Freelancer freelancer)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        using var transaction = connection.BeginTransaction();

        try
        {
            var existing = await connection.QueryFirstOrDefaultAsync<Freelancer>(
                "SELECT * FROM Freelancers WHERE Id = @Id",
                new { Id = freelancer.Id }, transaction);

            if (existing == null)
                throw new KeyNotFoundException("Freelancer not found.");

            var username = string.IsNullOrEmpty(freelancer.Username) ? existing.Username : freelancer.Username;
            var email = string.IsNullOrEmpty(freelancer.Email) ? existing.Email : freelancer.Email;
            var phone = string.IsNullOrEmpty(freelancer.Phone) ? existing.Phone : freelancer.Phone;

            if (!string.IsNullOrEmpty(freelancer.Email))
            {
                var emailExists = await connection.QuerySingleAsync<int>(
                    "SELECT COUNT(1) FROM Freelancers WHERE Email = @Email AND Id <> @Id",
                    new { Email = freelancer.Email, Id = freelancer.Id }, transaction);

                if (emailExists > 0)
                    throw new Exception("Email already exists for another freelancer.");
            }

            await connection.ExecuteAsync(
                "UPDATE Freelancers SET Username = @Username, Email = @Email, Phone = @Phone WHERE Id = @Id",
                new { Username = username, Email = email, Phone = phone, Id = freelancer.Id },
                transaction);

            if (freelancer.Skillsets != null)
            {
                await connection.ExecuteAsync(
                    "DELETE FROM FreelancerSkillsets WHERE FreelancerId = @Id",
                    new { Id = freelancer.Id }, transaction);

                foreach (var skill in freelancer.Skillsets)
                {
                    await connection.ExecuteAsync(
                        "INSERT INTO FreelancerSkillsets (FreelancerId, SkillsetOptionId) VALUES (@FreelancerId, @SkillsetOptionId)",
                        new { FreelancerId = freelancer.Id, SkillsetOptionId = skill.Id }, transaction);
                }
            }

            if (freelancer.Hobbies != null)
            {
                await connection.ExecuteAsync(
                    "DELETE FROM FreelancerHobbies WHERE FreelancerId = @Id",
                    new { Id = freelancer.Id }, transaction);

                foreach (var hobby in freelancer.Hobbies)
                {
                    await connection.ExecuteAsync(
                        "INSERT INTO FreelancerHobbies (FreelancerId, HobbyOptionId) VALUES (@FreelancerId, @HobbyOptionId)",
                        new { FreelancerId = freelancer.Id, HobbyOptionId = hobby.Id }, transaction);
                }
            }

            transaction.Commit();

            var updated = await connection.QuerySingleAsync<Freelancer>(
                "SELECT * FROM Freelancers WHERE Id = @Id",
                new { Id = freelancer.Id });

            return updated;
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
        await connection.OpenAsync();
        using var transaction = connection.BeginTransaction();

        try
        {
            
            await connection.ExecuteAsync("DELETE FROM FreelancerSkillsets WHERE FreelancerId = @Id", new { Id = id }, transaction);
            await connection.ExecuteAsync("DELETE FROM FreelancerHobbies WHERE FreelancerId = @Id", new { Id = id }, transaction);

            
            await connection.ExecuteAsync("DELETE FROM Freelancers WHERE Id = @Id", new { Id = id }, transaction);

            transaction.Commit();
        }
        catch
        {
            transaction.Rollback();
            throw;
        }
    }




    public async Task ArchiveAsync(int id, bool archive)
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        await connection.ExecuteAsync(
            "UPDATE Freelancers SET IsArchived = @IsArchived WHERE Id = @Id",
            new { Id = id, IsArchived = archive });
    }
}