import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  messageContainer = 'Unread';
  constructor(private route: ActivatedRoute, private alertify: AlertifyService, private messageService: MessageService
    , private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(
      resData => {
        this.messages = resData['messages'].result;
      }
    );
  }

  loadMessages(){
    this.messageService.getMessages(this.authService.decodedToken.nameid, null, null,  this.messageContainer)
    .subscribe(
      (messagesResponse: PaginatedResult<Message[]>)=> {
        this.messages = messagesResponse.result;
        this.alertify.success('Messages From ' + this.messageContainer);
      }
      , error =>{
        this.alertify.error('Error Occured While Fetching the Messages');
      }
    );
  }

  deleteMessage(id: number){
    if (confirm('Are you Sure you want to delete the Message')){
      this.messageService.deleteMessage(this.authService.decodedToken.nameid, id).subscribe(
        ()=>{
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
          this.alertify.success('Message Deleted Successfully');
        },
        error => {
          this.alertify.error(error);
        }
      );
    }
  }

}
