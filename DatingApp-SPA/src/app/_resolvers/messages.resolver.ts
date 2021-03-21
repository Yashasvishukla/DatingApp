import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Message } from "../_models/message";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { MessageService } from "../_services/message.service";

Injectable();

export class MessagesResolver implements Resolve<Message[]>
{
    constructor(private messageService: MessageService, private alertify: AlertifyService,
        private route: Router, private authService: AuthService){}
        messageContainer = 'Unread';
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Message[] | Observable<Message[]> | Promise<Message[]> {
        return this.messageService.getMessages(this.authService.decodedToken.nameid, null, null , this.messageContainer).pipe(
            catchError(error => {
                this.alertify.error('Problem in reteriving Messages');
                this.route.navigate(['/home']);
                return of(null);
            })
        );
    }
}