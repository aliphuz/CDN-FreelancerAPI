namespace CDN.FreelancerAPI.Domain.Entities;

public class Freelancer
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public bool IsArchived { get; set; }
    public List<Skillset> Skillsets { get; set; } = new();
    public List<Hobby> Hobbies { get; set; } = new();
}