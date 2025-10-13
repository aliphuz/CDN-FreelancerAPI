using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.Interfaces;
using CDN.FreelancerAPI.Application.UseCases;
using CDN.FreelancerAPI.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace CDN.FreelancerAPI.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HobbyController : ControllerBase
    {
        private readonly HobbyService _service;
        public HobbyController(HobbyService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var hobbies = await _service.GetALlAsync();
            return Ok(hobbies);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateHobbyDto dto)
        {
            try
            {
                var hobby = await _service.CreateHobbyAsync(dto);
                return Ok(new { message = "Hobby created", hobby });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHobby(int id)
        {
            await _service.DeleteHobby(id);
            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchHobby(int id, [FromBody]UpdateHobbyDto dto)
        {
            var updated = await _service.UpdateHobbyAsync(id, dto);
            if (updated == null)
            {
                return NotFound(new { message = "Hobby not found" });
            }
            return Ok(updated);
        }
    }
}
