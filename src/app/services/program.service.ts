
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {forkJoin, Observable, pipe, ReplaySubject, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';
import {ConditionService} from './condition.service';

@Injectable({providedIn: 'root'})
export class ProgramService {
  // tslint:disable-next-line:variable-name
  private _currentProgram: Program;
  private conditonsLoadedForId: string;
  // tslint:disable-next-line:variable-name
  private conditionsSubject: ReplaySubject<Array<Condition>>;
  private programListSubject: ReplaySubject<Array<Program>>;

  get currentProgram(): Program {
    if (this._currentProgram === undefined) {
      this._currentProgram = new Program();
    }
    return this._currentProgram;
  }

  getAvailableConditions(programId: string): Observable<Array<Condition>> {
    if (programId !== this.conditonsLoadedForId) {
      this.conditonsLoadedForId = programId;
      this.conditionsSubject = new ReplaySubject<Array<Condition>>(1);
      this.conditionService.listForProgram(programId).subscribe(
        data => this.conditionsSubject.next(data),
      );
    }
    return this.conditionsSubject;
  }

  constructor(private http: HttpClient,
              private conditionService: ConditionService) {
  }

  save(program: Program, update= false): Observable<Program> {
    let url = '/program';
    if (update) {
      url += '/update';
    } else {
      url += '/save';
    }

    return this.http.post<Program>(`${environment.apiUrl}${url}`, program);
  }

  private listPlain(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/program/list`);
  }

  list(): Observable<Array<Program>> {
    this.programListSubject = new ReplaySubject<Array<Program>>(1);
    this.listPlain().pipe(map(data => {
        const programs = new Array<Program>();
        data.forEach(jsonProgram => programs.push(Program.fromJson(jsonProgram)));
        return programs;
      }
    )).subscribe(
      data => this.programListSubject.next(data as Array<Program>),
      );
    return this.programListSubject;
  }

  listCached(): Observable<Array<Program>> {
    return this.programListSubject;
  }

  listAsTreeNode(): Observable<TreeNode[]> {
    return this.listPlain()
      .pipe(map(data => {
        const nodes = new Array<TreeNode>();

        data.forEach(program => {
          const programNode = {
            data: {
              col1: program.id,
              col2: program.programType,
              controls: true,
              type: 'program'
            },
            children: []
          };

          if (program.grants.length) {
            programNode.children.push({
              data: {
                col1: 'Grant ID',
                col2: 'Grant date',
                col3: 'Wait end',
                col4: 'End date',
                col5: 'Quantity',
                type: 'header'
              }});
          }

          program.grants.forEach(grant => {
            const grantNode = {
              data: {
                col1: grant.id,
                col2: grant.grantDate,
                col3: grant.waitUntil,
                col4: grant.endDate,
                col5: grant.quantity,
                controls: true,
                type: 'grant'
              },
              children: []
            };

            if (grant.conditions.length) {
              grantNode.children.push({
                data: {
                  col1: 'Condition ID',
                  col2: 'Condition Type',
                  type: 'header'
                }});
            }

            grant.conditions.forEach(condition => {
              const conditionNode = {
                data: {
                  col1: condition.id,
                  col2: condition.conditionType,
                  type: 'condition'
                }
              };
              grantNode.children.push(conditionNode);
            });

            programNode.children.push(grantNode);
          });

          nodes.push(programNode);
        });

        return nodes;
      }));
  }

  delete(programId: Array<string>): Observable<any> {
    const obeservables = Array<Observable<any>>();
    obeservables.push(this.http.delete(`${environment.apiUrl}/program/delete/${programId}`));
    return forkJoin(obeservables);
  }

  copy(oldProgramId: string, newProgramId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/program/copy/${oldProgramId}/${newProgramId}`, null).pipe(map(
      data => Program.fromJson(data)
    ));
  }

  loadProgram(id: string): Observable<Program>  {
    this._currentProgram = new Program();
    const ret = new Subject<any>();
    return this.http.get(`${environment.apiUrl}/program/${id}`)
      .pipe(map(data => {
        if (data == null){
          ret.error('Could not find program');
          return null;
        }
        this._currentProgram = Program.fromJson(data);
        return this.currentProgram;
      }));
  }
}
