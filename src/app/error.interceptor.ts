import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {environment} from '../environments/environment';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {
  }

  private static errorDict = {
    PROGRAM_EXISTS: {
      key: 'toast', severity: 'error',
      summary: 'Existing ID!',
      detail: 'Program with this ID already exists! Please choose a different ID'
    },
    PROGRAM_NOT_EXISTS: {
      key: 'toast', severity: 'error',
      summary: 'Program does not exist!',
      detail: ''
    },
    GRANT_EXISTS: {
      key: 'toast', severity: 'error',
      summary: 'Existing ID!',
      detail: 'Grant with this ID already exists! Please choose a different ID'
    },
  };

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log('error with request');
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        // this.accountService.logout();
      }
      if (err.status === 0) {
        // auto logout if 401 response returned from api
        this.messageService.add({
          key: 'toast', severity: 'error',
          summary: 'Servers appear to be offline, please try again later!',
          detail: 'If the problem persists please contact us via email help@incentrium.com'
        });
        return throwError(false);
      }
      if (err.status === 400) {
        if (err.error in ErrorInterceptor.errorDict) {
          this.messageService.add(ErrorInterceptor.errorDict[err.error]);
          return throwError(false);
        }
        if (!environment.production) {
          this.messageService.add({key: 'toast', severity: 'warn', summary: 'undefined error, please add to dict'});
        }
      }
      return throwError(true);
    }));
  }
}
