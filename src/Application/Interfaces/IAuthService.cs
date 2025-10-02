using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDN.FreelancerAPI.Application.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);

        Task<User?> ValidateRefreshTokenAsync(string refreshToken);
        string CreateToken(User user);
        Task<string> GenerateAndSaveRefreshTokenAsync(User user);

    }
}
