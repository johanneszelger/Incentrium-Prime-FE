
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {Observable, pipe, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';
import {Grant} from '../models/grant.model';

@Injectable({providedIn: 'root'})
export class GrantService {

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
}
