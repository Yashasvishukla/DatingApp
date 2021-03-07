using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T> (T entity) where T :class;
        void Delete<T> (T entity) where T:class;
        Task<bool> SaveAll();

        Task<IEnumerable<User>> GetUsers(UserParmas userParams);

        /* Task<PagedList<User>> GetUsers(UserParams userParmas); */
        
        Task<User> GetUser(int id);

        Task<Photo> GetPhoto(int id);

        Task<Photo> GetMainPhotoForUser(int id);
        Task<Like> GetLike(int userId, int recipientId);

    }
}