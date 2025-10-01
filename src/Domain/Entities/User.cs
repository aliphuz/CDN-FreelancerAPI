

namespace CDN.FreelancerAPI.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
