import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', {static: true}) editForm: NgForm;
  user: User;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(private router: ActivatedRoute, private userService: UserService,
          private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.router.data.subscribe(
      userData => {
        this.user = userData['user'];
      }
    );
  }


  updateUser(){
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
      data => {
        this.alertify.success('Updated Profile Successfully');
        this.editForm.reset(this.user);
      },
      error => {
        this.alertify.error('Error occured while updating' + error);
      }
    );
  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl = photoUrl;
    this.authService.photoUrl.next(this.user.photoUrl);
  }

}
