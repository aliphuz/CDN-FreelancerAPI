namespace CDN.FreelancerAPI.Application.DTOs;

public class CreateFreelancerDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } 
    public string Phone { get; set; } = string.Empty;
    public int UserId { get; set; }
    public List<int> SkillsetIds { get; set; } = new();
    public List<int> HobbyIds { get; set; } = new();
}