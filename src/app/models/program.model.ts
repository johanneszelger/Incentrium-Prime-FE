import {ProgramType} from './programType.model';
import {Grant} from './grant.model';
import {Condition} from './condition.model';

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
    jsonGrants.forEach(jsonGrant => {
      p.grants.push(Grant.fromJson(jsonGrant));
    });
    const jsonConditions = p.conditions;
    jsonConditions.forEach(jsonCondition => {
      p.conditions.push(Condition.fromJson(jsonCondition));
    });
    return p;
  }
}
