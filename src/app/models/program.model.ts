import {ProgramType} from './programType.model';
import {Grant} from './grant.model';

export class Program {
  public id: number;
  public name: string;
  public programType: ProgramType;
  public grants: Array<Grant>;

  constructor() {
    this.grants = new Array<Grant>();
  }

  static fromJson(data): Program {
    const p = Object.assign(new Program(), data);
    const jsonGrants = p.grants;
    p.grants = new Array<Grant>();
    jsonGrants.forEach(jsonGrant => {
      p.grants.push(Grant.fromJson(jsonGrant));
    });
    return p;
  }
}
