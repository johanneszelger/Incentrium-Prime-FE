import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor, HttpResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {AccountService} from './services/account.service';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor {

  constructor(private accountService: AccountService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({withCredentials: true});

    if (!req.url.startsWith(environment.apiUrl + '/auth/') && environment.production) {
      const expired = this.accountService.isExpired();
      if (expired === 1) {
        const gotToken = new Subject<HttpEvent<any>>();
        this.accountService.renew().subscribe(() => {
          this.intercept(req, next).subscribe(res => gotToken.next(res), err => gotToken.error(err));
        });
        return gotToken.asObservable();
      } else if (expired === 0) {
        req = req.clone({
          setHeaders: {
            Authorization: this.accountService.getToken()
          }
        });
        return next.handle(req);
      } else {
        console.log('user logged out due to inactivity');
        return throwError(new HttpResponse({status: -1}));
      }
    } else {
      return next.handle(req);
    }
  }
}
