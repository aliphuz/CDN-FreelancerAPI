namespace CDN.FreelancerAPI.Domain.Entities;

public class Hobby
{
    public int Id { get; set; }
    public int FreelancerId { get; set; }
    public string HobbyName { get; set; } = string.Empty;
}