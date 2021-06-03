import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {group} from '@angular/animations';
import {Grant} from '../../models/grant.model';
import {Clipboard} from '@angular/cdk/clipboard';
import { saveAs } from 'file-saver';

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

  constructor(private clipboard: Clipboard) {
  }

  ngOnInit(): void {
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

  copyDataToClipboard(): void {
    const text = this.generateTableText('\t');
    this.clipboard.copy(text);
  }

  downloadAsCsv(): void {
    const text = this.generateTableText(',');
    const data: Blob = new Blob([text], { type: 'text/csv' });
    saveAs(data, 'vesting.csv');
  }

  private generateTableText(spacer: string): string {
    let text = '';
    text += 'Program' + spacer;
    text += 'Grant' + spacer;
    text += 'Begin vesting' + spacer;
    text += 'End vesting' + spacer;

    this.vestingData[0]?.data?.dates.forEach(d => {
      text += d + ' ' + 'Debit' + spacer;
      text += d + ' ' + this.reserveName + spacer;
    });
    text += '\n';

    this.vestingData.forEach(grantData => {
      grantData.children.forEach(grantSplitData => {
        text += grantSplitData.data.programName + spacer;
        text += grantSplitData.data.grantName + spacer;
        text += grantSplitData.data.begin + spacer;
        text += grantSplitData.data.end + spacer;
        for (let i = 0; i < grantSplitData.data.credit.length; i++) {
          text += grantSplitData.data.credit[i] + spacer;
          text += grantSplitData.data.debit[i] + spacer;
        }
        text += '\n';
      });
    });

    // if total was calcd
    const total = this.vestingData[this.vestingData.length - 1];
    if (total?.data?.grantName === 'Total') {

      text += total.data.grantName + spacer.repeat(4);
      for (let i = 0; i < total.data.credit.length; i++) {
        text += total.data.debit[i] + spacer;
        text += total.data.credit[i] + spacer;
      }
    }

    return text;
  }
}
