import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;
  constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(recipientId: number){
    const currentUserId = this.authService.decodedToken.nameid;
    this.userService.sendLike(currentUserId, recipientId as number).subscribe(
      data => {
        this.alertify.success('You have Liked the user ' + this.user.knownAs);
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

}
