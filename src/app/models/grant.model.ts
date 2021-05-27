import {Program} from './program.model';
import {Condition} from './condition.model';
import {ConditionType} from './conditionType.model';
import * as moment from 'moment';

export class Grant {
  public id: number;
  public name: string;
  public programId: number;
  public programName: string;
  public vestingStartDate: Date;
  public grantDate: Date;
  public endDate: Date;
  public waitUntil: Date;
  public quantity: number;
  public plDate: Date;
  conditions: Array<Condition>;
  leavers: Array<any>;

  constructor() {
    this.conditions = new Array<Condition>();
  }

  static fromJson(data): Grant {
    const g = Object.assign(new Grant(), data);
    if (g.vestingStartDate) {
      g.vestingStartDate = new Date(g.vestingStartDate);
    }
    if (g.grantDate) {
      g.grantDate = new Date(g.grantDate);
    }
    if (g.waitUntil) {
      g.waitUntil = new Date(g.waitUntil);
    }
    if (g.endDate) {
      g.endDate = new Date(g.endDate);
    }
    if (g.plDate) {
      g.plDate = new Date(g.plDate);
    }

    const jsonConditions = g.conditions;
    g.conditions = new Array<Grant>();
    jsonConditions.forEach(jsonCondition => {
      g.conditions.push(Condition.fromJson(jsonCondition));
    });
    return g;
  }

  getKey(): string {
    if (this.id === undefined) {
      return this.name + this.programName + this.programId?.toString() + this.quantity + this.grantDate?.toDateString()
        + this.endDate?.toDateString() + this.waitUntil?.toDateString() + this.plDate?.toDateString();
    }
    return this.id.toString();
  }

  clone(): Grant {
    return this.copyWithQuantity(this.quantity);
  }

  private copyWithQuantity(newQuantity: number): Grant {
    const copy = new Grant();
    copy.programId = this.programId;
    copy.programName = this.programName;
    copy.quantity = newQuantity;
    copy.grantDate = this.grantDate;
    copy.endDate = this.endDate;
    copy.waitUntil = this.waitUntil;
    copy.plDate = this.plDate;
    return copy;
  }

  getServiceCondition(): Condition {
    const conds = this.conditions.filter((c) => c.conditionType === ConditionType.SERVICE);
    return conds.length === 0 ? null : conds[0];
  }

  getLeaverForDate(date: moment.Moment): any {
    const found = this.leavers?.filter(l => new Date(l.vestingDate).toDateString() === date.toDate().toDateString());
    if (found.length === 0) { return null; }
    return found[0];
  }
}
