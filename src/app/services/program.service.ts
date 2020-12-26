
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {Observable, pipe, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';

@Injectable({providedIn: 'root'})
export class ProgramService {
  // tslint:disable-next-line:variable-name
  private _currentProgram: Program;

  set currentProgram(currentProgram: Program) {
    this._currentProgram = currentProgram;
  }
  get currentProgram(): Program {
    return this._currentProgram;
  }

  constructor(private http: HttpClient) {
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

  list(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/program/list`);
  }

  listAsTreeNode(): Observable<TreeNode[]> {
    return this.list()
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

  delete(programId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/program/delete/${programId}`);
  }

  loadAndSetProgram(id: string): Observable<any>  {
    const ret = new Subject<any>();
    this.http.get(`${environment.apiUrl}/program/${id}`).pipe(first())
      .subscribe(data => {
        if (data == null){
          ret.error('Could not find program');
          return;
        }

        this.currentProgram = Program.fromJson(data as string);
        ret.next();
      });
    return ret.asObservable();
  }
}
