using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.UseCases;
using CDN.FreelancerAPI.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
        return CreatedAtAction(nameof(GetFreelancer), new { id = freelancer.Id }, freelancer);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetFreelancer(int id)
    {
        var freelancer = await _freelancerService.GetFreelancerByIdAsync(id);
        return freelancer == null ? NotFound() : Ok(freelancer);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllFreelancers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var freelancers = await _freelancerService.GetAllFreelancersAsync(page, pageSize);
        return Ok(freelancers);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchFreelancers([FromQuery] string keyword)
    {
        var freelancers = await _freelancerService.SearchFreelancersAsync(keyword);
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