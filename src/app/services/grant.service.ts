
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {Observable, pipe, ReplaySubject, Subject} from 'rxjs';
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

  loadGrant(programId: string, grantId: string): Observable<Grant > {
    const ret = new Subject<any>();
    return this.http.get(`${environment.apiUrl}/grant/${programId}/${grantId}`)
      .pipe(map(data => {
        if (data == null) {
          ret.error('Could not find grant');
          return null;
        }
        const grant = Grant.fromJson(data);
        return grant;
      }));
  }
}
