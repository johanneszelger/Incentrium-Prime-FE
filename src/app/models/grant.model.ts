import {Program} from './program.model';
import {Condition} from './condition.model';

export class Grant {
  public id: string;
  public programId: string;
  public employee: string;
  public grantDate: Date;
  public endDate: Date;
  public waitUntil: Date;
  public quantity: number;
  public plDate: Date;
  conditions: Array<Condition>;

  constructor(programId: string) {
    this.programId = programId;
    this.conditions = new Array<Condition>();
  }

  static fromJson(data): Grant {
    const g = Object.assign(new Grant(data.programId), data);
    if (g.grantDate) { g.grantDate = new Date(g.grantDate); }
    if (g.waitUntil) { g.waitUntil = new Date(g.waitUntil); }
    if (g.endDate) { g.endDate = new Date(g.endDate); }
    if (g.plDate) { g.plDate = new Date(g.plDate); }

    const jsonConditions = g.conditions;
    g.conditions = new Array<Grant>();
    jsonConditions.forEach(jsonCondition => {
      g.conditions.push(Condition.fromJson(jsonCondition));
    });
    return g;
  }

  clone(newId: string): Grant {
    return this.copyWithQuantity(newId, this.quantity);
  }

  private copyWithQuantity(newId: string,  newQuantity: number): Grant {
    const copy = new Grant(this.programId);
    copy.id = newId;
    copy.quantity = newQuantity;
    copy.grantDate = this.grantDate;
    copy.endDate = this.endDate;
    copy.waitUntil = this.waitUntil;
    copy.plDate = this.plDate;
    return copy;
  }
}
