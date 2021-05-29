import {Component, OnInit} from '@angular/core';
import {Program} from '../models/program.model';
import {Valuation} from '../models/valuation.model';
import {YearService} from '../services/year.service';
import {ProgramService} from '../services/program.service';
import {ValuationService} from '../services/valuation.service';
import {forkJoin, Observable} from 'rxjs';
import {VestingService} from '../services/vesting.service';
import {Periodicity} from '../models/periodicity.model';
import {MessageService} from 'primeng/api';
import {finalize} from 'rxjs/operators';
import {ProgramType} from '../models/programType.model';

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
  businessDate: Date;
  periodicity: Periodicity;
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
    this.programService.listGroupedByProgramType().pipe(finalize(() => this.loading = false)).subscribe(data => {
      this.groupedPrograms = data.groupedPrograms;
      this.grouped = data.grouped;
    });
  }

  getVestingTable(vestingInput: []): void {
    this.fetching = true;
    this.vestingService.vest(this.selectedProgram.id, this.periodicity, this.businessDate, vestingInput)
      .pipe(finalize(() => this.fetching = false)).subscribe(
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
    if (this.selectedProgram.programType === ProgramType.EQUITY_SETTLED) {
      this.reserveName = 'Reserve';
    } else {
      this.reserveName = 'Credit';
    }
  }
}
