import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {environment} from '../environments/environment';
import {AccountService} from './auth/login/account.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService,
              private accountService: AccountService) {
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
    BAD_CRED: {
      key: 'toast', severity: 'error',
      summary: 'Bad credentials!',
      detail: 'Login failed due to bad credentials, after 5 unsuccessful attempts, your account will be locked for 24h.',
      life: 5000,
    },
    ACC_EXP: {
      key: 'toast', severity: 'error',
      summary: 'Account expired!',
      detail: 'This account is no longer valid. Please contact your admin if you need to prolong it!',
      life: 5000
    },
    ACC_LOCKED: {
      key: 'toast', severity: 'error',
      summary: 'Account locked!',
      detail: 'This is likely due to too many failed login attempts.',
      life: 5000
    },
    NOT_AUTHORIZED: {
      key: 'toast', severity: 'error',
      summary: 'Unauthorized action!',
      detail: 'An unauthorized action was detected.'
    },
    SELF_DELETE: {
      key: 'toast', severity: 'error',
      summary: 'Cannot delete own account!',
      detail: 'You cannot delete your own account. Ask another admin to do so or contact Incentrium!',
      life: 5000
    },
    SELF_LOCK: {
      key: 'toast', severity: 'error',
      summary: 'Cannot lock own account!',
      detail: 'You cannot lock your own account. Ask another admin to do so or contact Incentrium!',
      life: 5000
    },
    MAIL_ERROR: {
      key: 'toast', severity: 'error',
      summary: 'Could not send mail!',
      detail: 'The server had problems sending a required email. Please try again later!',
      life: 5000
    },
  };

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log('error with request');
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.accountService.logout();
        if (err.error in ErrorInterceptor.errorDict) {
          this.messageService.add(ErrorInterceptor.errorDict[err.error]);
          return throwError(false);
        }
        if (!environment.production) {
          this.messageService.add({key: 'toast', severity: 'warn', summary: 'undefined error, please add to dict', detail: err.error});
        }
      }
      if (err.status === 403) {
        this.messageService.add({key: 'toast', severity: 'warn', summary: 'Login needed to view data', detail: ''});
        this.accountService.logout();
        return throwError(false);
      }
      if (err.status === 0) {
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
          this.messageService.add({key: 'toast', severity: 'warn', summary: 'undefined error, please add to dict', detail: err.error});
        }
      }
      return throwError(true);
    }));
  }
}
