using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.UseCases;
using CDN.FreelancerAPI.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

    [Authorize(Roles = "User,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateFreelancer([FromBody] CreateFreelancerDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        dto.UserId = int.Parse(userIdClaim);

        try
        {

            var freelancer = await _freelancerService.CreateFreelancerAsync(dto);
            return CreatedAtAction(nameof(GetFreelancerById), new { id = freelancer.Id }, freelancer);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFreelancerById(int id)
    {
        var freelancer = await _freelancerService.GetFreelancerByIdAsync(id);
        return freelancer == null ? NotFound() : Ok(freelancer);
    }

   
    [HttpGet("paged")]
    public async Task<IActionResult> GetFreelancersPaged([FromQuery] int pageNumber, [FromQuery] int pageSize, [FromQuery] string? search = null)
    {
        var freelancers = await _freelancerService.GetFreelancersPagedAsync(pageNumber, pageSize, search);
        return Ok(freelancers);
    }

    [Authorize(Roles = "User,Admin")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateFreelancer(int id, [FromBody] UpdateFreelancerDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;
        try
        {
            var freelancer = await _freelancerService.UpdateFreelancerAsync(id, dto, userId, userRole);
            return Ok(freelancer);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "User,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFreelancer(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;
        try
        {
            await _freelancerService.DeleteFreelancerAsync(id, userId, userRole);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex) 
        {
            return Forbid(ex.Message);
        }
        catch(KeyNotFoundException ex)
        {
            return NotFound(new {message = ex.Message});
        }
        catch(Exception ex)
        {
            return BadRequest(new { ex.Message });
        }

    }

    [Authorize(Roles = "User,Admin")]
    [HttpPatch("{id}/archive")]
    public async Task<IActionResult> ArchiveFreelancer(int id, [FromBody] ArchiveFreelancerDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var userRole = User.FindFirstValue(ClaimTypes.Role)!;

        try
        {
            await _freelancerService.ArchiveFreelancerAsync(id, dto.IsArchived, userId,userRole);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
       
    }
}
