import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Program} from '../../models/program.model';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {finalize, map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AccountService implements CanActivate {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  login(credentials): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/authenticate`, credentials).pipe(
      map(
        userData => {
          sessionStorage.setItem('username', credentials.username);
          const tokenStr = 'Bearer ' + userData.token;
          sessionStorage.setItem('token', tokenStr);
          return userData;
        }
      )
    );
  }

  logout(): void {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('username') !== null;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['login']);
  }
}
