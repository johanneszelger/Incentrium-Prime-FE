import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'inc-vesting-table',
  templateUrl: './vesting-table.component.html',
  styleUrls: ['./vesting-table.component.scss']
})
export class VestingTableComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() reserveName;

  stdCols = [
    {field: 'grantName', header: 'Grant'},
    {field: 'begin', header: 'Begin'},
    {field: 'end', header: 'End'},
  ];
  cols;

  constructor() {
  }

  ngOnInit(): void {
    this.data = [];
    this.cols = this.stdCols;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cols = Object.assign([], this.stdCols);
    if (this.data !== undefined && this.data[0] !== undefined && this.data[0].dates !== undefined) {
      this.data[0].dates.forEach(d => this.cols.push({field: 'dates', header: d, type: 'date'}));

      const totalDebit = [];
      const totalCredit = [];
      for (let i = 0; i < this.data[0].dates.length; i++) {
        totalDebit.push(this.data.map(data => data.debit[i]).reduce((sum, current) => sum + current, 0));
        totalCredit.push(this.data.map(data => data.credit[i]).reduce((sum, current) => sum + current, 0));
      }

      this.data.push({grantName: 'Total', debit: totalDebit, credit: totalCredit, dates: this.data[0].dates});
      this.data = this.data.splice(0);
    }
  }

}
