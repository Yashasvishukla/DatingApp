import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
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
user: User = JSON.parse(localStorage.getItem('user'));
pagination: Pagination;
genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
userParams: any = {};


  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.users = data['users'].result;
        this.pagination = data['users'].pagination;
      }
    );

    this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male' ;
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  // pageChanged(event: any){
  //   this.pagination.currentPage = event.page;
  //   console.log(this.pagination.currentPage);
  //   this.loadUsers();
  // }

loadUsers(): void{
  this.userService.getUsers(this.userParams).subscribe(
    (res: PaginatedResult<User[]>) => {
      debugger;
      this.users = res.result;
      this.pagination = res.pagination;
    },
    error => {
      this.alertify.error('error');
    }
  );
}

resetFilters(){
    this.userParams.gender = this.user.gender === 'male' ? 'female' : 'male' ;
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.loadUsers();
}


}
