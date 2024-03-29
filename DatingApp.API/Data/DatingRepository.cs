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
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return user;
        }



        public async Task<IEnumerable<User>> GetUsers(UserParmas userParams)
        {
            IEnumerable<int> UsersId = await _context.Users.Select(i => i.Id).ToListAsync();
            if (userParams.Likers)
            {
                UsersId = await GetUserLikes(userParams.UserId, userParams.Likers);
            }
            if (userParams.Likees)
            {
                UsersId = await GetUserLikes(userParams.UserId, userParams.Likers);
            }



            var minDob = DateTime.Now.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Now.AddYears(userParams.MinAge);

            var users = string.IsNullOrEmpty(userParams.OrderBy) == true ? await _context.Users.Include(p => p.Photos).Where(u => u.Id != userParams.UserId).
               Where(u => u.Gender == userParams.Gender).Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob).OrderByDescending(u => u.LastActive).Where(u => UsersId.Contains(u.Id)).ToListAsync()
               : (userParams.OrderBy.Equals("created") ? await _context.Users.Include(p => p.Photos).Where(u => u.Id != userParams.UserId).
               Where(u => u.Gender == userParams.Gender).Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob).OrderByDescending(u => u.Created).Where(u => UsersId.Contains(u.Id)).ToListAsync()
               : await _context.Users.Include(p => p.Photos).Where(u => u.Id != userParams.UserId).
               Where(u => u.Gender == userParams.Gender).Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob).OrderByDescending(u => u.LastActive).Where(u => UsersId.Contains(u.Id)).ToListAsync());




            return users;
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(u => u.Likers)
                .Include(u => u.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }

            return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
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
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
            return message;
        }



        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Include(s => s.Sender).ThenInclude(p => p.Photos)
                .Include(r => r.Recipient).ThenInclude(p => p.Photos)
                .Where(m => m.SenderId == userId && m.RecipientId == recipientId && m.RecipientDeleted == false
                    || m.SenderId == recipientId && m.RecipientId == userId && m.SenderDeleted == false)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            return messages;
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            // Fetch all the messages
            var message = _context.Messages
                .Include(u => u.Sender).ThenInclude(s => s.Photos)
                .Include(r => r.Recipient).ThenInclude(r => r.Photos)
                .AsQueryable();

            // Apply filters
            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    message = message.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    message = message.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                case "Unread":
                    message = message.Where(u => u.RecipientId == messageParams.UserId && u.IsRead == false && u.RecipientDeleted == false);
                    break;
            }

            // Order the message

            message = message.OrderByDescending(m => m.MessageSent);
            return await PagedList<Message>.CreateAsync(message, messageParams.PageNumber, messageParams.PageSize);

        }
    }
}