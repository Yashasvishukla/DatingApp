import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  model : any = {};
  constructor(private AuthService: AuthService) { }

  ngOnInit() {
  }

  login(){
    this.AuthService.login(this.model).subscribe(next=>{
      console.log('Logged in successfully')
    },error=>{
      console.log('Falied to login')
    });
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !!token;
  }

  loggedOut(){
    localStorage.removeItem('token');
    console.log("Logged out");
  }

}
