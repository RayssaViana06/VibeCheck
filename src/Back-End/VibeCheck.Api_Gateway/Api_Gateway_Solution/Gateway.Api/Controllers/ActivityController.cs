using Gateway.Domain.Interfaces;
using Gateway.Domain.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gateway.Api.Controllers
{
    [ApiController]
    public class ActivityController(IActivityServices activityServices) : ControllerBase
    {
        private readonly IActivityServices _activityServices = activityServices;

        private string AuthHeader =>
            Request.Headers["Authorization"].ToString();

        [Authorize(Roles = "psicologo")]
        [HttpGet("gateway/activities")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _activityServices.GetAllAsync(AuthHeader);
            return Ok(result);
        }

        [Authorize(Roles = "psicologo")]
        [HttpGet("gateway/activities/{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var result = await _activityServices.GetByIdAsync(id, AuthHeader);
            return Ok(result);
        }

        [Authorize(Roles = "psicologo")]
        [HttpPost("gateway/activities")]
        public async Task<IActionResult> Create([FromBody] ActivityRequest body)
        {
            var result = await _activityServices.CreateAsync(body, AuthHeader);
            return StatusCode(201, result);
        }

        [Authorize(Roles = "psicologo")]
        [HttpPut("gateway/activities/{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] ActivityRequest body)
        {
            await _activityServices.UpdateAsync(id, body, AuthHeader);
            return NoContent();
        }

        [Authorize(Roles = "psicologo")]
        [HttpDelete("gateway/activities/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _activityServices.DeleteAsync(id, AuthHeader);
            return NoContent();
        }
    }
}