using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController: ControllerBase
    {
       private readonly IDatingRepository _repo;
       private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo,IMapper mapper){
           _repo = repo;
           _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParmas userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetUser(currentUserId);
            userParams.UserId = currentUserId;
             
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = userFromRepo.Gender == "male" ? "female" : "male";
            }

            var users = await _repo.GetUsers(userParams);


            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }


        /*
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams){
            var users = await _repo.GetUsers(userParams);
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            // Attaching the pagination information inside headers
            Response.AddPagination(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages);

            return Ok(usersToReturn);
        }
        */

        [HttpGet("{id}", Name ="GetUser")]
        public async Task<IActionResult> GetUser(int id){
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }
            var userFromRepo = await _repo.GetUser(id);

            // map the user with the UserForUpdateDto containing the updated changes
            _mapper.Map(userForUpdateDto, userFromRepo);

            // Save the changes in the database
            if(await _repo.SaveAll())
                return NoContent();

            throw new System.Exception($"Error occured while saving {id}");

        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if( id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            if(await _repo.GetLike(id, recipientId) != null)
            {
                return BadRequest("You have already Liked the User!");
            }

            if(await _repo.GetUser(recipientId) == null)
            {
                return NotFound();
            }

            var like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };


            _repo.Add<Like>(like);
            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to Like the User");
        }

    }


}