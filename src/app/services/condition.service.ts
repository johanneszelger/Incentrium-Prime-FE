import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {forkJoin, Observable, ReplaySubject, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';
import {ConditionType} from '../models/conditionType.model';
import {Program} from '../models/program.model';

@Injectable({providedIn: 'root'})
export class ConditionService {
  private conditonsLoadedForId: number = null;
  private conditionsSubject: ReplaySubject<Array<Condition>>;

  constructor(private http: HttpClient) {
  }

  private listForProgram(programId: number): Observable<Array<Condition>> {
    return (this.http.get(`${environment.apiUrl}/condition/listAvailableForProgram/${programId || ''}`) as Observable<any>)
      .pipe(map(data => {
        const conditions = new Array<Condition>();
        data.forEach(jsonCondition => conditions.push(Condition.fromJson(jsonCondition)));
        return conditions;
      }));
  }

  private listPlain(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/condition/list/`);
  }

  list(): Observable<Array<Condition>> {
    return this.listPlain().pipe(map(data => {
      const conditions = new Array<Condition>();
      data.forEach(jsonCondition => conditions.push(Condition.fromJson(jsonCondition)));
      return conditions;
    }));
  }

  listAsTreeNode(): Observable<TreeNode[]> {
    return this.listPlain()
      .pipe(map(data => {
        const nodes = new Array<TreeNode>();

        data.forEach(condition => {
          const conditionNode = {
            data: {
              col1: condition.id,
              col2: condition.programName,
              col3: condition.name,
              col4: condition.conditionType,
              col5: '',
              col6: '',
              controls: true,
              type: 'condition'
            },
            children: []
          };

          if (condition.conditionType === ConditionType.CAP) {
            conditionNode.data.col5 = 'Cap: ';
            conditionNode.data.col6 = condition.cap;
          }

          if (condition.conditionType === ConditionType.MARKET_ABS
            && condition.marketAbsConditionParameters.length) {
            conditionNode.children.push({
              data: {
                col5: 'Absolute Value',
                col6: 'Grant Fraction',
                type: 'header'
              }
            });
            condition.marketAbsConditionParameters.forEach(para => {
              conditionNode.children.push({
                data: {
                  col5: para.absValue,
                  col6: para.grantFraction,
                  type: 'paramAbs'
                }
              });
            });
          }


          if (condition.conditionType === ConditionType.MARKET_REL
            && condition.marketRelConditionParameters.length) {
            conditionNode.children.push({
              data: {
                col5: 'Relative Value',
                col6: 'Grant Fraction',
                type: 'header'
              }
            });
            condition.marketRelConditionParameters.forEach(para => {
              conditionNode.children.push({
                data: {
                  col5: para.relValue,
                  col6: para.grantFraction,
                  type: 'paramRel'
                }
              });
            });
          }
          nodes.push(conditionNode);
        });

        return nodes;

      }));

  }

  delete(conditionIds: Array<string>): Observable<any> {
    const obeservables = Array<Observable<any>>();
    conditionIds.forEach(id => obeservables.push(this.http.delete(`${environment.apiUrl}/condition/delete/${id}`)));
    return forkJoin(obeservables);
  }

  loadCondition(id: string): Observable<Condition> {
    return this.http.get(`${environment.apiUrl}/condition/${id}`)
      .pipe(map(data => {
        return Condition.fromJson(data);
      }));
  }

  save(condition: Condition, update = false): Observable<Condition> {
    let url = '/condition';
    if (update) {
      url += '/update';
    } else {
      url += '/save';
    }

    return this.http.post<Condition>(`${environment.apiUrl}${url}`, condition);
  }


  getAvailableConditions(programId: number): Observable<Array<Condition>> {
    if (programId !== this.conditonsLoadedForId) {
      this.conditonsLoadedForId = programId;
      this.conditionsSubject = new ReplaySubject<Array<Condition>>(1);
      this.listForProgram(programId).subscribe(
        data => {
          this.conditionsSubject.next(data);
          this.conditionsSubject.complete();
        },
        err => this.conditionsSubject.error(err)
      );
    }
    return this.conditionsSubject;
  }
}
