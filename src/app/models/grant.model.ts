import {Program} from './program.model';

export class Grant {
  public id: string;
  public programId: string;
  public employee: string;
  public grantDate: Date;
  public endDate: Date;
  public waitUntil: Date;
  public quantity: number;
  public plDate: Date;

  constructor(programId: string) {
    this.programId = programId;
  }

  static fromJson(data): Grant {
    const g = Object.assign(new Grant(data.programId), data);
    g.grantDate = new Date(g.grantDate);
    g.waitUntil = new Date(g.waitUntil);
    g.endDate = new Date(g.endDate);
    g.plDate = new Date(g.plDate);
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
