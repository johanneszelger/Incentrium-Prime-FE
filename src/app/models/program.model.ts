import {ProgramType} from './programType.model';
import {Grant} from './grant.model';
import {Condition} from './condition.model';
import {ConditionType} from './conditionType.model';

export class Program {
  public id: number;
  public name: string;
  public programType: ProgramType;
  public grants: Array<Grant>;
  public conditions: Array<Condition>;

  constructor() {
    this.grants = new Array<Grant>();
    this.conditions = new Array<Condition>();
  }

  static fromJson(data): Program {
    const p = Object.assign(new Program(), data);
    const jsonGrants = p.grants;
    p.grants = [];
    jsonGrants.forEach(jsonGrant => {
      p.grants.push(Grant.fromJson(jsonGrant));
    });
    const jsonConditions = p.conditions;
    p.conditions = [];
    jsonConditions.forEach(jsonCondition => {
      p.conditions.push(Condition.fromJson(jsonCondition));
    });
    return p;
  }

  getPerformanceConditions(): Condition[] {
    return this.conditions.filter((c) => c.conditionType === ConditionType.PERFORMANCE_NON_VESTING
      || c.conditionType === ConditionType.PERFORMANCE_VESTING);
  }

  getServiceCondition(): Condition {
    const conds = this.conditions.filter((c) => c.conditionType === ConditionType.SERVICE);
    return conds.length === 0 ? null : conds[0];
  }
}
