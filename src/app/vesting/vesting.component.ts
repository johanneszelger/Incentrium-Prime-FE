import {Component, OnInit} from '@angular/core';
import {Program} from '../models/program.model';
import {Valuation} from '../models/valuation.model';
import {YearService} from '../services/year.service';
import {ProgramService} from '../services/program.service';
import {ValuationService} from '../services/valuation.service';
import {forkJoin, Observable} from 'rxjs';
import {VestingService} from '../services/vesting.service';
import {Periodicity} from '../models/periodicity.model';
import {MessageService} from "primeng/api";
import {finalize} from "rxjs/operators";
import {ProgramType} from "../models/programType.model";

@Component({
  selector: 'inc-vesting',
  templateUrl: './vesting.component.html',
  styleUrls: ['./vesting.component.scss']
})
export class VestingComponent implements OnInit {
  loading: boolean;
  periodicityEnum = Periodicity;
  groupedPrograms: Program[];
  selectedProgram;
  grouped = true;
  fetching: boolean;
  valuations: Valuation[];
  valuationsFiltered: Valuation[];
  selectedValuation;
  businessDate: Date;
  periodicity: Periodicity;
  fluctuation: number;
  performances: number[];
  vestingData: any;
  reserveName: string;

  constructor(private programService: ProgramService,
              private valuationService: ValuationService,
              public yearService: YearService,
              private vestingService: VestingService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loading = true;
    const dataSubscriptions = new Array<Observable<any>>();
    dataSubscriptions.push(this.programService.listGroupedByProgramType());
    dataSubscriptions.push(this.valuationService.listAll());
    forkJoin(dataSubscriptions).pipe(finalize(() => this.loading = false)).subscribe((res) => {
      this.groupedPrograms = res[0].groupedPrograms;
      this.grouped = res[0].grouped;
      this.valuations = res[1];
      this.filterValuations();
    });
  }

  getVestingTable(): void {
    this.fetching = true;
    this.vestingService.vest(this.selectedProgram.id, this.selectedValuation.id, this.fluctuation,
      this.periodicity, this.performances).pipe(finalize(() => this.fetching = false)).subscribe(
      data => {
        this.vestingData = data;
      },
      error => {
        if (error) {
          this.messageService.add({
            key: 'toast',
            severity: 'error',
            summary: 'Could not calculate vesting',
            detail: ''
          });
        }
      }
    );
  }

  programChanged(): void {
    this.filterValuations();
    this.performances = [];
    this.selectedProgram.getPerformanceConditions().forEach(c => this.performances.push(null));
    if (this.selectedProgram.programType === ProgramType.EQUITY_SETTLED) {
      this.reserveName = 'Capital Reserve';
    } else {
      this.reserveName = 'Accrual';
    }
  }

  filterValuations(): Valuation[] {
    return this.valuationsFiltered = this.valuations
      .filter(v => v.progress === 1)
      .filter(v => this.selectedProgram === undefined || v.programId === this.selectedProgram.id)
      .filter(v => this.businessDate === undefined || this.businessDate === null ||
        v.businessDate.toLocaleDateString() === this.businessDate.toLocaleDateString());
  }

}
