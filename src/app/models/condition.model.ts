import {ConditionType} from './conditionType.model';

export class Condition {
  public id: number;
  public companyId: number;
  public name: string;
  public programId: number;
  public programName: string;
  public conditionType: ConditionType;
  marketAbsConditionParameters = new Array<MarketAbsConditionParameter>();
  marketRelConditionParameters = new Array<MarketRelConditionParameter>();
  cap: number;

  static fromJson(data): Condition {
    const c = Object.assign(new Condition(), data);
    return c;
  }
}
export class MarketAbsConditionParameter {
  absValue: number; grantFraction: number;
}
export class MarketRelConditionParameter {
  relValue: number; grantFraction: number;
}
