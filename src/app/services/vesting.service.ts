
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
import {Periodicity} from '../models/periodicity.model';

@Injectable({providedIn: 'root'})
export class VestingService {

  constructor(private http: HttpClient) {
  }

  getDates(programId: number, periodicity: Periodicity): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/vesting/dates/${programId}/${periodicity}`);
  }

  vest(programId: number, valuationId: number, fluctuationNumber: number, periodicity: Periodicity,
       performanceNumbers: number[]): Observable<any> {
    const fluctuation = (fluctuationNumber / 100).toString();
    const performances = performanceNumbers.map(a => (a / 100).toString());
    const body = {
      programId,
      valuationId,
      fluctuation,
      periodicity,
      performances
    };
    return this.http.post<any>(`${environment.apiUrl}/vesting/vest`, body);
  }
}
