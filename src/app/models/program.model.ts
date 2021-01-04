import {ProgramType} from './programType.model';
import {Grant} from './grant.model';

export class Program {
  public id: string;
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

  public clone(copyId: string): Program {
    const copy = new Program();
    copy.id = copyId;
    copy.programType = this.programType;
    copy.grants = [];
    this.grants.forEach((g) => copy.grants.push(g.clone(g.id)));
    copy.grants.forEach((g) => g.programId = copyId);
    return copy;
  }
}
