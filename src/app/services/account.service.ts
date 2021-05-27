import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Role} from '../models/role.model';
import {MessageService} from 'primeng/api';

@Injectable({providedIn: 'root'})
export class AccountService implements CanActivate {
  private MAX_MINUTES_TILL_LOGOUT = 30;
  private loggedIn: Subject<void>;
  private renewed: Subject<void>;

  constructor(private http: HttpClient,
              private router: Router,
              private messageService: MessageService) {
  }

  login(credentials): Observable<void> {
    this.loggedIn = new Subject();
    this.http.post<any>(`${environment.apiUrl}/auth/authenticate`, credentials).subscribe(
      userData => {
        this.saveAuthToken(userData);
        this.renew().subscribe(succ => this.loggedIn.next());
      }, err => {
        this.loggedIn.error(err);
      }
    );
    return this.loggedIn.asObservable();
  }

  renew(): Observable<void> {
    this.renewed = new Subject();
    this.http.post<any>(`${environment.apiUrl}/auth/access`, this.getAuthToken()).subscribe(
      userData => {
        this.saveAccessData(userData);
        this.renewed.next();
      }
    );
    return this.renewed;
  }

  resetPassword(code: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/changepassword`, {code, newPassword}).pipe(
      map(userData => {
          this.saveAuthToken(userData);
        }
      )
    );

  }

  private saveAuthToken(userData): void {
    localStorage.setItem('authToken', userData.authToken);
  }

  private saveAccessData(userData): void {
    this.saveAuthToken(userData);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('company', userData.company);
    localStorage.setItem('company-logo', userData.companyLogo);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('validUntil', userData.validUntil);
    const tokenStr = 'Bearer ' + userData.accessToken;
    localStorage.setItem('accessToken', tokenStr);
    return userData;
  }

  logout(redirect = true): void {
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('validUntil');
    if (redirect) {
      this.router.navigate(['auth/login']);
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('username') !== null || !environment.production;
  }

  isExpired(): number {
    if (!localStorage.getItem('accessToken') && localStorage.getItem('authToken')) {
      return 1;
    }

    if (new Date(parseInt(localStorage.getItem('validUntil'), 10)) < new Date()) {
      if (new Date(localStorage.getItem('validUntil')).getTime() + 1000 * 60 * this.MAX_MINUTES_TILL_LOGOUT
        < new Date().getTime() ) {
        this.logout(true);
        this.messageService.add({
          key: 'toast', severity: 'error',
          summary: 'Login expired!',
          detail: 'Please login again!',
          life: 5000
        });
        return 2;
      }
      return 1;
    }
    return 0;
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

  getToken(): string {
    return localStorage.getItem('accessToken');
  }

  private getAuthToken(): string {
    return localStorage.getItem('authToken');
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
