namespace CDN.FreelancerAPI.Domain.Entities;

public class Skillset
{
    public int Id { get; set; }
    public int FreelancerId { get; set; }
    public string SkillName { get; set; } = string.Empty;
}