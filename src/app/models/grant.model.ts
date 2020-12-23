import {Program} from './program.model';

export class Grant {
  public id: string;
  public programId: string;
  public employee: string;
  public grantDate: Date;
  public endDate: Date;
  public quantity: number;
  public plDate: Date;
  public hasPlDate: boolean;

  constructor(programId: string) {
    this.programId = programId;
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
    return copy;
  }
}
