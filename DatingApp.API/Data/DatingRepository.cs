using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _conext;
        public DatingRepository(DataContext conext)
        {
            _conext = conext;

        }
        public void Add<T>(T entity) where T : class
        {
            _conext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _conext.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _conext.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _conext.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _conext.Users.Include(p=> p.Photos).FirstOrDefaultAsync(x=>x.Id==id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users =await _conext.Users.Include(p=>p.Photos).ToListAsync();
            return users;

        }

        public async Task<bool> SaveAll()
        {
            return await _conext.SaveChangesAsync() >0 ;
        }
    }
}