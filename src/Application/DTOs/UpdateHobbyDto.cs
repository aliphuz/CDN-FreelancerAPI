using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CDN.FreelancerAPI.Application.DTOs
{
    public class UpdateHobbyDto
    {
        public string? Name { get; set; } = string.Empty;
        public string? HobbyDescription { get; set; } = string.Empty;
    }
}
