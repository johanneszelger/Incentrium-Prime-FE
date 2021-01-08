
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
import {Company} from '../models/company.model';

@Injectable({providedIn: 'root'})
export class CompanyService {

  constructor(private http: HttpClient) {
  }

  save(user: User, update = false): Observable<Company> {
    let url = '/company';
    if (update) {
      url += '/update';
    } else {
      url += '/save';
    }
    return this.http.post<Company>(`${environment.apiUrl}${url}`, user);
  }

  loadCompany(companyId: number): Observable<Company> {
    const ret = new Subject<any>();
    return this.http.get(`${environment.apiUrl}/company/${companyId}`)
      .pipe(map(data => {
        const company = Company.fromJson(data);
        return company;
      }));
  }

  private listPlain(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/company/list`);
  }

  list(): Observable<Array<Company>> {
    return this.listPlain().pipe(map(data => {
        const users = new Array<Company>();
        data.forEach(jsonCompany => users.push(Company.fromJson(jsonCompany)));
        return users;
      }
    ));
  }

  delete(companyIds: number[]): Observable<any> {
    const obeservables = Array<Observable<any>>();
    companyIds.forEach(id => {
      obeservables.push(this.http.delete(`${environment.apiUrl}/company/delete/${id}`));
    });
    return forkJoin(obeservables);
  }
}
