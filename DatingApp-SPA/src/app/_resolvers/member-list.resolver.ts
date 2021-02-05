import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/user.service";

@Injectable()
export class MemeberListResolver implements Resolve<User[]>{
    constructor(private userService: UserService, private alertify : AlertifyService, private route: Router) {}

    resolve(): Observable<User[]>{
        return this.userService.getUsers().pipe(
            catchError(error => {
                this.alertify.error('Problem Reteriving MemberData');
                this.route.navigate(['/home']);
                return of(null);
            })
        );
    }
    
}