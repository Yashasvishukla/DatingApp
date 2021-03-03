using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
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



        public async Task<IEnumerable<User>> GetUsers(UserParmas userParams)
        {
            
            var minDob = DateTime.Now.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Now.AddYears(userParams.MinAge);

            var users = string.IsNullOrEmpty(userParams.OrderBy) == true ? await _conext.Users.Include(p => p.Photos).Where(u => u.Id != userParams.UserId).
               Where(u => u.Gender == userParams.Gender).Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob).OrderByDescending(u => u.LastActive).ToListAsync()
               : (userParams.OrderBy.Equals("created") ? await _conext.Users.Include(p => p.Photos).Where(u => u.Id != userParams.UserId).
               Where(u => u.Gender == userParams.Gender).Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob).OrderByDescending(u => u.Created).ToListAsync()
               : await _conext.Users.Include(p => p.Photos).Where(u => u.Id != userParams.UserId).
               Where(u => u.Gender == userParams.Gender).Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob).OrderByDescending(u => u.LastActive).ToListAsync());




            return users;
        }

        /* Pagination Implementation */

        /*
        public async Task<PagedList<User>> GetUsers(UserParams userParmas)
        {
            var users = _conext.Users.Include(p => p.Photos); // Since we wan to deffer the execution so we won't we doing toListAsync here;

            return await PagedList<User>.CreateAsync(users, userParmas.PageNumber, userParmas.PageSize);

        } 
        */

        public async Task<bool> SaveAll()
        {
            return await _conext.SaveChangesAsync() >0 ;
        }

    }
}