import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error =>{
                if(error.status === 401){
                    return throwError(error.statusText);
                }

                // For 500 type error
                if(error instanceof HttpErrorResponse){
                    const ApplicationError = error.headers.get('Application-Error');
                    if(ApplicationError){
                        return throwError(ApplicationError);
                    }
                }

                // Rest of the errors
                const serverError = error.error;
                let modelState = '';
                if(serverError.errors && typeof serverError.errors === 'object'){
                    for(const key in serverError.errors){
                        if(serverError.errors[key]){
                            modelState += serverError.errors[key] + '\n';
                        }
                    }
                }

                return throwError(modelState || serverError || 'Server Error');
            })
        );
    }
}


// Expose the interceptor 
export const ErrorInterceptorProvider = {
    provide : HTTP_INTERCEPTORS,
    useClass : ErrorInterceptor,
    multi : true
};