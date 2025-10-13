using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.UseCases;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CDN.FreelancerAPI.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly SkillService _service;

        public SkillController(SkillService service)
        {
         _service = service;   
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var skill = await _service.GetAllAsync();
            return Ok(skill);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]CreateSkillDto dto)
        {
            try
            {
                var skill = await _service.CreateSkillAsync(dto);
                return Ok(new { message = "Skill created", skill });
            }
            catch(InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteSKill(int id)
        {
            await _service.DeleteSkill(id);
            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchSkill (int id, [FromBody]UpdateSkillsetDto dto)
        {
            var updated = await _service.UpdateSkillsetAsync(id, dto);
            if(updated == null)
            {
                return NotFound(new { message = "Skill Not found" });

            }
            return Ok(updated);
        }

    }
}
