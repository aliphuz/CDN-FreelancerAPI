using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CDN.FreelancerAPI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FreelancersController : ControllerBase
{
    private readonly FreelancerService _freelancerService;

    public FreelancersController(FreelancerService freelancerService)
    {
        _freelancerService = freelancerService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateFreelancer([FromBody] CreateFreelancerDto dto)
    {
       

        var freelancer = await _freelancerService.CreateFreelancerAsync(dto);
        return CreatedAtAction(nameof(GetFreelancerById), new { id = freelancer.Id }, freelancer);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFreelancerById(int id)
    {
        var freelancer = await _freelancerService.GetFreelancerByIdAsync(id);
        return freelancer == null ? NotFound() : Ok(freelancer);
    }

    [Authorize]
    [HttpGet("options")]
    public async Task<IActionResult> GetOptions()
    {
        var skills = await _freelancerService.GetSkillOptionsAsync();
        var hobbies = await _freelancerService.GetHobbyOptionsAsync();
        return Ok(new { skillsets = skills, hobbies = hobbies });
    }


   
    [HttpGet("paged")]
    public async Task<IActionResult> GetFreelancersPaged([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] string? search = null)
    {
        var freelancers = await _freelancerService.GetFreelancersPagedAsync(pageNumber, pageSize, search);
        return Ok(freelancers);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFreelancer(int id, [FromBody] UpdateFreelancerDto dto)
    {
        var freelancer = await _freelancerService.UpdateFreelancerAsync(id, dto);
        return Ok(freelancer);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFreelancer(int id)
    {
        await _freelancerService.DeleteFreelancerAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/archive")]
    public async Task<IActionResult> ArchiveFreelancer(int id, [FromBody] ArchiveFreelancerDto dto)
    {
        await _freelancerService.ArchiveFreelancerAsync(id, dto.IsArchived);
        return NoContent();
    }
}
