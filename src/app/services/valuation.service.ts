
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

@Injectable({providedIn: 'root'})
export class ValuationService {

  constructor(private http: HttpClient) {
  }

  save(valuation: Valuation, update = false): Observable<Valuation> {
    let url = '/valuation';
    if (update) {
      url += '/update';
    } else {
      url += '/save';
    }

    return this.http.post<Valuation>(`${environment.apiUrl}${url}`, valuation);
  }

  loadValuation(valuationId: number): Observable<Valuation > {
    const ret = new Subject<any>();
    return this.http.get(`${environment.apiUrl}/valuation/${valuationId}`)
      .pipe(map(data => {
        if (data == null) {
          ret.error('Could not load valuation');
          return null;
        }
        const valuation = Valuation.fromJson(data);
        return valuation;
      }));
  }

  loadProgress(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/valuation/listprogress`);
  }
}
