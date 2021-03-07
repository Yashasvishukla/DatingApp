import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { UserService } from "../_services/user.service";

@Injectable()

export class ListsResolver implements Resolve<User[]>{
    likeParams = 'Likers';
    constructor(private router: Router, private userSerive: UserService, private alertify: AlertifyService){}
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userSerive.getUsers(null, this.likeParams).pipe(
            catchError( error => {
                this.alertify.error('Problem in Retriving the Data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}