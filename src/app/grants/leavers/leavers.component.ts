import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Condition} from '../../models/condition.model';
import {Grant} from '../../models/grant.model';
import {Program} from '../../models/program.model';
import * as moment from 'moment';
import {YearService} from '../../services/year.service';

@Component({
  selector: 'inc-leavers',
  templateUrl: './leavers.component.html',
  styleUrls: ['./leavers.component.scss']
})
export class LeaversComponent implements OnInit {
  _program: Program;
  get program(): Program {
    return this._program;
  }

  @Input() set program(value: Program) {
    this._program = value;
    this.determineData();
  }

  _grant: Grant;
  @Output() grantChange: EventEmitter<Grant> = new EventEmitter();
  get grant(): Grant {
    return this._grant;
  }

  @Input() set grant(value: Grant) {
    this._grant = value;
    this.determineData();
  }

  leaverData = [];

  constructor(public yearService: YearService) {
  }

  ngOnInit(): void {
  }

  determineData(): void {
    this.leaverData = undefined;
    let cond = null;
    if (this._grant === undefined || this._grant.vestingStartDate === undefined
      || this._grant.quantity === undefined) { return; }

    cond = this._grant.getServiceCondition();
    if (cond === null && this._program !== undefined) {
      cond = this._program.getServiceCondition();
    }

    if (cond !== null) {
      const newLeaverData = [];
      cond.serviceConditionParameters.forEach((p) => {
        const date = moment(this._grant.vestingStartDate).add(p.monthsAfterStart, 'months');
        const leaverDate = this._grant.getLeaverForDate(date)?.leaverDate;
        newLeaverData.push(
          {
            date,
            quantity: p.grantFraction / 100 * this._grant.quantity,
            leaverDate: leaverDate === undefined ? null : new Date(this._grant.getLeaverForDate(date)?.leaverDate),
            expired: this._grant.getLeaverForDate(date)?.quantity,
          }
        );
      });
      this.leaverData = newLeaverData;
    }
  }

  updateLeavers(): void {
    this._grant.leavers = [];
    this.leaverData.filter(l => l.expired).forEach(l => {
      this._grant.leavers.push({
        vestingDate: l.date,
        leaverDate: l.leaverDate,
        quantity: l.expired,
      });
    });
    this.grantChange.emit(this._grant);
  }
}
