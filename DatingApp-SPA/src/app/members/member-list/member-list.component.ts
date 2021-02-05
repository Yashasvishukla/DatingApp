import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }
users: User[];
  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.users = data['users'];
      }
    );
  }


// getUsers(){
//   this.userService.getUsers().subscribe((
//     usersData: User[]) => {
//       this.users = usersData;
//     },
//     error => {
//       this.alertify.error(error);
//     }
//    );
// }

}
