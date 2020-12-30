
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {Observable, pipe, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';

@Injectable({providedIn: 'root'})
export class ConditionService {

  constructor(private http: HttpClient) {
  }

  listForProgram(programId: string): Observable<Array<Condition>> {
    return (this.http.get(`${environment.apiUrl}/condition/listAvailableForProgram/${programId}`) as Observable<any>)
      .pipe(map(data => {
        const conditions = new Array<Condition>();
        data.forEach(jsonCondition => conditions.push(Condition.fromJson(jsonCondition)));
        return conditions;
    }));
  }
}
