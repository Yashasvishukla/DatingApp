import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  message: any = {};
  constructor(private messageService: MessageService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessageThreads();
  }

  loadMessageThreads(){
    const currentUserId = +this.authService.decodedToken.nameid;
    this.messageService.getMessageThreads(this.authService.decodedToken.nameid, this.recipientId)
    .pipe(
      tap( messages => {
        for (const message of messages) {
          if (message.isRead === false && message.recipientId === currentUserId){
              this.messageService.markMessageAsRead(currentUserId, message.id);
          }
        }
      })
    )
    .subscribe(
      messageThread => {
        this.messages = messageThread;
      },
      error => {
        this.alertify.error('Problem reteriving the Conversation');
      }
    );
  }

  sendMessage(){
    this.message.senderId = this.authService.decodedToken.nameid;
    this.message.recipientId = this.recipientId;
    this.messageService.sendMessage(this.authService.decodedToken.nameid, this.message).subscribe(
      (messageResp: Message)=>{
        messageResp.senderKnownAs = this.authService.currentUser.knownAs;
        messageResp.senderPhotoUrl = this.authService.currentUser.photoUrl;
        this.messages.unshift(messageResp);
        this.message.content = '';
      }, error =>{
        this.alertify.error('Error in Sending your message');
      }
    );
  }


}
