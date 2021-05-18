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
    {field: 'quantityExpected', header: 'Quantity'},
    {field: 'fairValue', header: 'Fair Value'},
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
    }
  }

}
