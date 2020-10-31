using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase                // We derived from the base if we want only the (MC) otherwise (Controller) for (MVC)
    {
        private readonly IAuthRepository _authRepo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository authRepo, IConfiguration config)
        {
            _config = config;
            _authRepo = authRepo;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            // Validate the request

            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if (await _authRepo.UserExists(userForRegisterDto.Username))
            {
                ModelState.AddModelError("", "Username Already Exists");
                return StatusCode(401, ModelState);
            }

            var userCreated = new User
            {
                Username = userForRegisterDto.Username
            };

            var createdUser = await _authRepo.Register(userCreated, userForRegisterDto.Password);
            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLogin)
        {
            var userFromRepo = await _authRepo.Login(userForLogin.Username.ToLower(), userForLogin.Password);
            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            //Grenerate Token and pass it to every request..
            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name,userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new {
                token = tokenHandler.WriteToken(token)
            });
        }

    }
}