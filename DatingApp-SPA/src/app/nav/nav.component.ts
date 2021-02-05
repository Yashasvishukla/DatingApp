import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }

  login(){
    this.authService.login(this.model).subscribe(() => {
      this.alertify.success('Logged in Successfully');
      this.router.navigateByUrl('/members');
    }, error => {
      this.alertify.error(error);
    });
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  logout(){
    this.alertify.success('logged out Successfully');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/home');
  }
}
