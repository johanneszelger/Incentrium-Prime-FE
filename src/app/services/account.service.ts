import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Program} from '../models/program.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {finalize, map} from 'rxjs/operators';
import {Role} from '../models/role.model';

@Injectable({providedIn: 'root'})
export class AccountService implements CanActivate {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  login(credentials): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/authenticate`, credentials).pipe(
      map(
        userData => {
          this.saveSuccessData(userData);
        }
      )
    );
  }

  resetPassword(code: string, newPassword: string): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/auth/changepassword`, {code, newPassword}).pipe(
      map(userData => {
          this.saveSuccessData(userData);
        }
      )
    );

  }

  saveSuccessData(userData): void {
    localStorage.setItem('username', userData.username);
    localStorage.setItem('company', userData.company);
    localStorage.setItem('company-logo', userData.companyLogo);
    localStorage.setItem('role', userData.role);
    const tokenStr = 'Bearer ' + userData.token;
    localStorage.setItem('token', tokenStr);
    return userData;
  }

  logout(redirect = true): void {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    if (redirect) {
      this.router.navigate(['auth/login']);
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('username') !== null;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['auth/login']);
  }

  getUsername(): string {
    return localStorage.getItem('username');
  }

  isSuperAdmin(): boolean {
    return localStorage.getItem('role') === Role.SUPER_ADMIN;
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === Role.ADMIN;
  }

  isUser(): boolean {
    return localStorage.getItem('role') === Role.USER;
  }


  checkCodeValid(code: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/auth/codevalid/${code}`);
  }

  requestReset(email: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/requestreset/${email}`);
  }

  getCompanyLogo(): string {
    return localStorage.getItem('company-logo');
  }
}
