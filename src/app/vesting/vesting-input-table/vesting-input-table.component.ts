import {Component, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {VestingService} from '../../services/vesting.service';
import {Periodicity} from '../../models/periodicity.model';
import {Program} from '../../models/program.model';
import {finalize} from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Valuation} from '../../models/valuation.model';
import {forkJoin, Observable} from 'rxjs';
import {ValuationService} from '../../services/valuation.service';
import {global} from '@angular/compiler/src/util';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
  selector: 'inc-vesting-input-table',
  templateUrl: './vesting-input-table.component.html',
  styleUrls: ['./vesting-input-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class VestingInputTableComponent implements OnInit {
  _program: Program;

  get program(): Program {
    return this._program;
  }

  @Input() set program(value: Program) {
    this._program = value;
    this.loadDates();
  }

  _businessDate: Date;

  get businessDate(): Date {
    return this._businessDate;
  }

  @Input() set businessDate(value: Date) {
    this._businessDate = value;
    this.loadDates();
  }

  _periodicity: Periodicity;

  get periodicity(): Periodicity {
    return this._periodicity;
  }

  @Input() set periodicity(value: Periodicity) {
    this._periodicity = value;
    this.loadDates();
  }

  private inputManuallyChanged = false;
  loading = false;
  cols: { type: string, header: string }[] = [];
  data = [];
  valuations: any[];

  constructor(private vestingService: VestingService,
              private valuationService: ValuationService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.loadDates();
  }

  private loadDates(): void {
    if (!this._program || !this._businessDate || !this._periodicity) {
      return;
    }

    this.loading = true;
    const dataSubscriptions = new Array<Observable<any>>();
    dataSubscriptions.push(this.valuationService.listAllGroupedDate(this._program.id));
    dataSubscriptions.push(this.vestingService.getDates(this.program.id, this.businessDate, this.periodicity));
    forkJoin(dataSubscriptions).pipe(finalize(() => this.loading = false)).subscribe((res) => {
      this.valuations = res[0];

      const newCols = [];
      newCols.push({type: '', header: ''});
      newCols.push({type: 'string', header: 'global'});
      res[1].forEach(d => newCols.push({type: 'date', header: d}));
      this.cols = newCols;
      this.initData();
    }, error => {
      const x = 0;
    });
  }

  private initData(): void {
    const newData = [];
    newData.push({type: 'valuation', name: 'Valuation', values: {}});
    newData.push({type: 'fluctuation', name: 'Fluctuation (%)', values: {}});
    for (let i = 0; i < this._program.getPerformanceConditions().length; i++) {
      newData.push({type: 'performance' + i, name: 'Performance ' + (i + 1) + ' (%)', values: {}});
    }

    for (const column of this.cols) {
      if (column.header === '') {
        continue;
      }
      const col = column.header;
      for (let i = 0; i < Math.min(this.data.length, newData.length); i++) {
        newData[i].values[col] = undefined;
        if (this.data?.[i]?.values?.[col]) {
          newData[i].values[col] = this.data[i].values[col];
        }
      }

      // TODO remove
      while (!this.valuations) {}
      for (let i = 0; i < Math.min(newData.length); i++) {
        if (!newData[i].values[col]) {
          if (i === 0) {
            newData[i].values[col] = this.valuations[0].items[0];
          } else if (i === 1) {
            newData[i].values[col] = 2;
          } else {
            newData[i].values[col] = 100;
          }
        }
      }
    }

    this.data = newData;
  }

  confirm($event: Event, type: string): void {
    if (!this.inputManuallyChanged) {
      this.copyGlobal(type);
      return;
    }
    const _this = this;
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      key: type,
      accept: () => {
        _this.copyGlobal(type);
      },
      reject: () => {
        // reject action
      }
    });
  }

  onManualValueChange(b: boolean): void {
    this.inputManuallyChanged = this.inputManuallyChanged || !b;
  }

  private copyGlobal(type: string): void {
    const toChange = this.data.filter(d => d.type === type);
    for (const col of this.cols) {
      if (col.header === 'global') {
        continue;
      }
      toChange[0].values[col.header] = toChange[0].values.global;
    }
  }
}
