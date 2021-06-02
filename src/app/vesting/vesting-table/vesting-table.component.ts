import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {group} from '@angular/animations';

@Component({
  selector: 'inc-vesting-table',
  templateUrl: './vesting-table.component.html',
  styleUrls: ['./vesting-table.component.scss']
})
export class VestingTableComponent implements OnInit, OnChanges {
  @Input() vestingData;
  @Input() reserveName;

  stdCols = [
    {field: 'grantName', header: 'Grant'},
    {field: 'begin', header: 'Begin'},
    {field: 'end', header: 'End'},
  ];
  cols;
  programTreeNodes: { data: any, children: [], grantName: any }[];

  constructor() {
  }

  ngOnInit(): void {
    this.vestingData = [];
    this.cols = this.stdCols;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cols = Object.assign([], this.stdCols);
    if (this.vestingData !== undefined
      && this.vestingData[0] !== undefined
      && this.vestingData[0].data.dates !== undefined) {
      this.vestingData[0].data.dates.forEach(d => this.cols.push({field: 'dates', header: d, type: 'date'}));
      // need empty cols for colspan 2 of credit debit
      this.vestingData[0].data.dates.forEach(d => this.cols.push({field: '', header: '', type: ''}));

      // this.programTreeNodes = [];
      // this.vestingData.forEach(data => {
      //   let grantNode = this.programTreeNodes.filter(n => n.grantName === data.grantName)?.[0];
      //   if (!grantNode) {
      //     grantNode = {
      //       data,
      //       grantName: data.grantName,
      //       children: []
      //     };
      //     this.programTreeNodes.push(grantNode);
      //   }
      // });

      const totalDebit = [];
      const totalCredit = [];
      for (let i = 0; i < this.vestingData[0].data.dates.length; i++) {
        totalDebit.push(this.vestingData.map(data => data.data.debit[i]).reduce((sum, current) => sum + current, 0));
        totalCredit.push(this.vestingData.map(data => data.data.credit[i]).reduce((sum, current) => sum + current, 0));
      }

      this.vestingData.push({
        data: {
          grantName: 'Total',
          debit: totalDebit, credit: totalCredit,
          dates: this.vestingData[0].data.dates
        },
        children: []
      });
      this.vestingData = this.vestingData.splice(0);
    }
  }

}
