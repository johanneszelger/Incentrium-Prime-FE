
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {forkJoin, Observable, pipe, ReplaySubject, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';
import {Grant} from '../models/grant.model';

@Injectable({providedIn: 'root'})
export class GrantService {
  private grantListSubject: ReplaySubject<Array<Grant>>;

  constructor(private http: HttpClient) {
  }

  save(grant: Grant, update = false): Observable<Grant> {
    let url = '/grant';
    if (update) {
      url += '/update';
    } else {
      url += '/save';
    }

    return this.http.post<Grant>(`${environment.apiUrl}${url}`, grant);
  }

  delete(grantIds: Array<number>): Observable<any> {
    const obeservables = Array<Observable<any>>();
    grantIds.forEach(id => {
      obeservables.push(this.http.delete(`${environment.apiUrl}/grant/delete/${id}`));
    });
    return forkJoin(obeservables);
  }

  private listPlain(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/grant/list`);
  }

  list(): Observable<Array<Grant>> {
    this.grantListSubject = new ReplaySubject<Array<Grant>>(1);
    this.listPlain().pipe(map(data => {
        const grants = new Array<Grant>();
        data.forEach(jsonGrant => grants.push(Grant.fromJson(jsonGrant)));
        return grants;
      }
    )).subscribe(
      data => {
        this.grantListSubject.next(data as Array<Grant>);
        this.grantListSubject.complete();
      },
      err => this.grantListSubject.error(err)
    );
    return this.grantListSubject;
  }

  loadGrant(grantId: number): Observable<Grant > {
    const ret = new Subject<any>();
    return this.http.get(`${environment.apiUrl}/grant/${grantId}`)
      .pipe(map(data => {
        if (data == null) {
          ret.error('Could not find grant');
          return null;
        }
        const grant = Grant.fromJson(data);
        return grant;
      }));
  }

  copy(id, copyName: string): Observable<Grant> {
    return this.http.post(`${environment.apiUrl}/grant/copy/${id}/${copyName}`, null).pipe(map(
      data => Grant.fromJson(data)
    ));
  }
}
