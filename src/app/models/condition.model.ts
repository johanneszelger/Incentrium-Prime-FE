import {ConditionType} from './conditionType.model';

export class Condition {
  public id: number;
  public name: string;
  public programId: string;
  public conditionType: ConditionType;


  static fromJson(data): Condition {
    const c = Object.assign(new Condition(), data);
    return c;
  }
}
