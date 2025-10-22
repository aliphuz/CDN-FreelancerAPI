using CDN.FreelancerAPI.Application.DTOs;
using CDN.FreelancerAPI.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            await _auth.RegisterAsync(dto);
            return Ok(new { message = "Registered" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        try
        {
            var res = await _auth.LoginAsync(dto);
            if (res == null)
                return Unauthorized(new { error = "Invalid" });

            Response.Cookies.Append("token", res.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                message = "Login Successful",
                role = res.Role,
                userId = res.userId,
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { error = "invalid" } );
        }
        catch(Exception ex) {
            return BadRequest(new {error = ex.Message});
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token");
        return Ok(new {message = "Logged out"});
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] string refreshToken)
    {
        try
        {
            var user = await _auth.ValidateRefreshTokenAsync(refreshToken);
            if (user == null)
                return Unauthorized(new { error = "Invalid or expired refresh token" });

            var newAccessToken = _auth.CreateToken(user);
            var newRefreshToken = await _auth.GenerateAndSaveRefreshTokenAsync(user);

            Response.Cookies.Append("token", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });
            return Ok(new
            {
                message = "Token Refreshed",
                refreshToken = newRefreshToken
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new {error = ex.Message});
        }
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        var token = Request.Cookies["token"];
        if (string.IsNullOrEmpty(token))
            return Unauthorized(new { message = "Not authenticated" });

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var role = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = "Authenticated",
                userId,
                role
            });
        }
        catch (Exception)
        {
            return Unauthorized(new { message = "Invalid or expired token" });
        }
    }






}
