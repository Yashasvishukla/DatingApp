import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private alertify: AlertifyService, private route: Router) { }

  getMessages(id: number, page? , itemsPerPage? , messageContainer? )
  {
      const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

      let params = new HttpParams();
      if (messageContainer != null){
        params = params.append('MessageContainer', messageContainer);
      }

      // if ( page != null && itemsPerPage != null){
      //   params = params.append('pageNumber', page);
      //   params = params.append('pageSize', itemsPerPage);
      // }
      return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params}).pipe(
        map( res => {
          paginatedResult.result = res.body;
          if (res.headers.get('Pagination')){
              paginatedResult.pagination = JSON.parse(res.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getMessageThreads(id: number, recipientId: number){
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId );
  }

  sendMessage(userId: number, message){
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages', message);
  }

  deleteMessage(userId: number, id: number){
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markMessageAsRead(userId: number, id: number){
    this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id + '/read', {}).subscribe();
  }
}
