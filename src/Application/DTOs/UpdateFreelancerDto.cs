namespace CDN.FreelancerAPI.Application.DTOs;

public class UpdateFreelancerDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public List<int> SkillsetIds { get; set; } = new();
    public List<int> HobbyIds { get; set; } = new();
}