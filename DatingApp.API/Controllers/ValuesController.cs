using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // Dependency Injection for the database use
        private readonly DataContext _db;
        public ValuesController(DataContext db)
        {
            _db = db;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetValues(){
            var obj = await _db.Values.ToListAsync();
            if(obj==null){
                ModelState.AddModelError("","No Data Found in Db");
                return StatusCode(400,ModelState);
            }
            return Ok(obj);
        }
        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetValue(int id){
            var value = await _db.Values.FirstOrDefaultAsync(x=>x.Id==id);
            if(value==null){
                ModelState.AddModelError("","No record found");
                return StatusCode(400,ModelState);
            }
            return Ok(value);
        }
        // [HttpPost]
        // public IActionResult CreateValue( [FromBody] Value value ){
        //     _db.Values.Add(value);
        //     return NoContent();

        // }
    }
}