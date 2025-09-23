namespace CDN.FreelancerAPI.Application.DTOs;

public class UpdateFreelancerDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public List<string> Skillsets { get; set; } = new();
    public List<string> Hobbies { get; set; } = new();
}