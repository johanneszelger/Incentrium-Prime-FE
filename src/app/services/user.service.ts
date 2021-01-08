
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {forkJoin, Observable, pipe, ReplaySubject, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';
import {Grant} from '../models/grant.model';
import {Valuation} from '../models/valuation.model';
import {User} from '../models/user.model';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) {
  }

  save(user: User, update = false): Observable<User> {
    let url = '/user';
    if (update) {
      url += '/update';
    } else {
      url += '/register';
    }
    return this.http.post<User>(`${environment.apiUrl}${url}`, user);
  }

  lockUnlock(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/lockunlock/${userId}`)
      .pipe(map(data => {
        const user = User.fromJson(data);
        return user;
      }));
  }

  loadUser(userId: number): Observable<User> {
    const ret = new Subject<any>();
    return this.http.get(`${environment.apiUrl}/user/${userId}`)
      .pipe(map(data => {
        const user = User.fromJson(data);
        return user;
      }));
  }

  private listPlain(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/list`);
  }

  list(): Observable<Array<User>> {
    return this.listPlain().pipe(map(data => {
        const users = new Array<User>();
        data.forEach(jsonUser => users.push(User.fromJson(jsonUser)));
        return users;
      }
    ));
  }

  delete(userids: number[]): Observable<any> {
    const obeservables = Array<Observable<any>>();
    userids.forEach(id => {
      obeservables.push(this.http.delete(`${environment.apiUrl}/user/delete/${id}`));
    });
    return forkJoin(obeservables);
  }

  resetPassword(userId: number): Observable<any> {
    return this.http.get<User>(`${environment.apiUrl}/user/resetPasswordFor/${userId}`);
  }
}
