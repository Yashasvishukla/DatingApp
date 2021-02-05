import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token){
      this.authService.decodedToken = this.authService.jwtHelper.decodeToken(token);
    }
  }
}
