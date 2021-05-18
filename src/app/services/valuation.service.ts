import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {Valuation} from '../models/valuation.model';
import {ProgramService} from './program.service';
import {Program} from "../models/program.model";

@Injectable({providedIn: 'root'})
export class ValuationService {

  constructor(private http: HttpClient,
              private programService: ProgramService) {
  }

  save(valuation: Valuation): Observable<Valuation> {
    return this.http.post<Valuation>(`${environment.apiUrl}/valuation/save`, valuation);
  }

  loadValuation(valuationId: number): Observable<Valuation> {
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

  loadValuationWithProgram(valuationId: number): Observable<any> {
    const ret = new Subject<any>();
    return (this.http.get(`${environment.apiUrl}/valuation/getWithProgram/${valuationId}`) as Observable<any>)
      .pipe(map(data => {
        if (data == null) {
          ret.error('Could not load valuation');
          return null;
        }
        const valuation = Valuation.fromJson(data.valuation);
        let programThen = null;
        let programNow = null;
        if (data.programThen !== null) {
          programThen = this.programService.createProgramNode(data.programThen);
        }
        if (data.programNow !== null) {
          programNow = this.programService.createProgramNode(data.programNow);
        }
        return {valuation, programThen, programNow};
      }));
  }

  loadProgress(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/valuation/listprogress`);
  }

  listAll(): Observable<any>  {
    return (this.http.get(`${environment.apiUrl}/valuation/list`) as Observable<any>).pipe(map(data => {
        const valuations = new Array<Valuation>();
        data.forEach(jsonValuation => valuations.push(Valuation.fromJson(jsonValuation)));
        return valuations;
      }
    ));
  }
}
