import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {
  users: User[];
  likeParams: string;

 constructor(private route: ActivatedRoute,
  private authService: AuthService, private userService: UserService, private alertify:  AlertifyService) { }
 
  ngOnInit() {
    this.route.data.subscribe(
      usersData => {
        this.users = usersData['users'].result;
      }
    );
    this.likeParams = 'Likers';
  }

  loadUsers(){
    this.userService.getUsers(null,this.likeParams).subscribe(
      (res: PaginatedResult<User []>) => {
        this.users = res.result;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

}
