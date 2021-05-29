import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {Observable, Subject, throwError} from 'rxjs';
import {Valuation} from '../models/valuation.model';
import {ProgramService} from './program.service';

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

  listAll(): Observable<Valuation[]>  {
    return (this.http.get(`${environment.apiUrl}/valuation/list`) as Observable<any>).pipe(map(data => {
        const valuations = new Array<Valuation>();
        data.forEach(jsonValuation => valuations.push(Valuation.fromJson(jsonValuation)));
        return valuations;
      }
    ));
  }

  listAllGroupedDate(programId?: number): Observable<any>  {
    const obs = this.listAll();
    return obs.pipe(map(valuationsUnfiltered => {
      const valuations = valuationsUnfiltered.filter(v => !programId || programId === v.programId);
      const grouped = [];

      const dates = new Set(valuations.map(val => val.businessDate));
      // tslint:disable-next-line:forin
      for (const item of dates) {
        grouped.push({
          label: item.toLocaleDateString(), value: item, items: new Array<string>()
        });
      }

      for (const valuation of valuations) {
        const group = grouped.filter(g => g.value === valuation.businessDate);
        group?.[0]?.items.push(valuation);
      }

      return grouped;
    }));
  }
}
