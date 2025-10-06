public class Freelancer
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public bool IsArchived { get; set; }

    public int UserId { get; set; }

    public List<HobbyOptions> Hobbies { get; set; } = new();
    public List<SkillsetOptions> Skillsets { get; set; } = new();
}

public class HobbyOptions
{
    public int Id { get; set; }
    public string HobbyName { get; set; } = string.Empty;
}

public class SkillsetOptions
{
    public int Id { get; set; }
    public string SkillName { get; set; } = string.Empty;
}
