import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {first, map} from 'rxjs/operators';
import {Program} from '../models/program.model';
import {forkJoin, Observable, pipe, ReplaySubject, Subject, throwError} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';
import {ConditionService} from './condition.service';
import {ProgramType} from '../models/programType.model';

@Injectable({providedIn: 'root'})
export class ProgramService {
  // tslint:disable-next-line:variable-name
  private _currentProgram: Program;
  private conditonsLoadedForId: string;
  // tslint:disable-next-line:variable-name
  private conditionsSubject: ReplaySubject<Array<Condition>>;
  private programListSubject: ReplaySubject<Array<Program>>;

  resetCurrentProgram(): void {
    this._currentProgram = undefined;
  }

  set currentProgram(p: Program) {
    this._currentProgram = p;
  }

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
        data => {
          this.conditionsSubject.next(data);
          this.conditionsSubject.complete();
        },
        err => this.conditionsSubject.error(err)
      );
    }
    return this.conditionsSubject;
  }

  constructor(private http: HttpClient,
              private conditionService: ConditionService) {
  }

  save(program: Program, update = false): Observable<Program> {
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
      data => {
        this.programListSubject.next(data as Array<Program>);
        this.programListSubject.complete();
      },
      err => this.programListSubject.error(err)
    );
    return this.programListSubject;
  }

  listGroupedByProgramType(): Observable<any> {
    return this.list().pipe(map(data => {
      const groupedPrograms = new Array();
      // tslint:disable-next-line:forin
      for (const item in ProgramType) {
        groupedPrograms.push({
          label: ProgramType[item], value: item, icon: this.getIconForProgramType(item), items: new Array<string>()
        });
      }
      data.forEach(p => {
        if (p.programType === ProgramType.EQUITY_SETTLED) {
          groupedPrograms[0].items.push(p);
        }
        if (p.programType === ProgramType.CASH_SETTLED) {
          groupedPrograms[1].items.push(p);
        } else {
          throwError('unknown program type: ' + p.programType);
        }
      });
      let groupedProgramsNonEmpty = new Array<any>();
      let grouped = true;
      groupedPrograms.forEach(group => {
        if (group.items.length > 0) {
          groupedProgramsNonEmpty.push(group);
        }
      });
      if (groupedProgramsNonEmpty.length === 1) {
        groupedProgramsNonEmpty = groupedProgramsNonEmpty[0].items;
        grouped = false;
      }
      return {groupedPrograms: groupedProgramsNonEmpty, grouped};
    }));
  }

  private getIconForProgramType(item: string): string {
    if (ProgramType[item] === ProgramType.EQUITY_SETTLED) {
      return 'pi pi-ticket';
    }
    if (ProgramType[item] === ProgramType.CASH_SETTLED) {
      return 'pi pi-money-bill';
    } else {
      throwError('unknown program type: ' + item);
    }
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
              }
            });
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
                }
              });
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

  listAsTreeNodesWithValuations(): Observable<TreeNode[]> {
    return (this.http.get(`${environment.apiUrl}/program/listWithValuations`) as Observable<any>).pipe(map(data => {
      const nodes = new Array<TreeNode>();

      data.forEach(programWithValuations => {
        const programNode = {
          data: {
            col1: programWithValuations.program.id,
            col2: programWithValuations.program.programType,
            col3: programWithValuations.program.grants.length,
            col4: new Date(Math.max.apply(null, programWithValuations.valuations.map(val => new Date(val.valuationDate)))),
            col5: new Date(Math.max.apply(null, programWithValuations.valuations.map(val => new Date(val.businessDate)))),
            type: 'program'
          },
          children: []
        };

        if (programWithValuations.valuations.length) {
          programNode.children.push({
            data: {
              col1: 'Valuated date',
              type: 'dateHeader'
            },
            children: []
          });

          const groupByBusinessDate = { };
          programWithValuations.valuations.forEach(valuation => {
            groupByBusinessDate [valuation.businessDate] =
              groupByBusinessDate [valuation.businessDate] || [];
            groupByBusinessDate[valuation.businessDate].push(valuation);
          });

          Object.entries(groupByBusinessDate).forEach(group => {
            const groupNode = {
              data: {
                col1: group[0],
                type: 'date'
              },
              children: []
            };

            groupNode.children.push({
              data: {
                col1: 'Valuation date',
                col2: 'Stockprice',
                col3: 'Volatility',
                col4: 'Risk-free interest',
                col5: 'Exercise Type',
                col6: 'Progress',
                type: 'valuationHeader'
              },
              children: []
            });

            (group[1] as Array<any>).forEach(valuation => {
              groupNode.children.push({
                data: {
                  col1: valuation.valuationDate,
                  col2: valuation.stockPrice,
                  col3: valuation.volatility,
                  col4: valuation.riskFreeInterest,
                  col5: valuation.exerciseType,
                  id:   valuation.id,
                  progress:  valuation.progress * 100,
                  type: 'valuation'
                },
                children: []
              });
            });

            programNode.children.push(groupNode);
          });
          const x = 0;
        }


        nodes.push(programNode);
      });

      return nodes;
    }));
  }

  delete(programIds: Array<string>): Observable<any> {
    const obeservables = Array<Observable<any>>();
    programIds.forEach(id => {
      obeservables.push(this.http.delete(`${environment.apiUrl}/program/delete/${id}`));
    });
    return forkJoin(obeservables);
  }

  copy(oldProgramId: string, newProgramId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/program/copy/${oldProgramId}/${newProgramId}`, null).pipe(map(
      data => Program.fromJson(data)
    ));
  }

  loadProgram(id: string): Observable<Program> {
    this._currentProgram = new Program();
    const ret = new Subject<any>();
    return this.http.get(`${environment.apiUrl}/program/${id}`)
      .pipe(map(data => {
        if (data == null) {
          ret.error('Could not find program');
          return null;
        }
        this._currentProgram = Program.fromJson(data);
        return this.currentProgram;
      }));
  }
}
