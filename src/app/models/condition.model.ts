import {ConditionType} from './conditionType.model';

export class Condition {
  public id: number;
  public name: string;
  public programId: string;
  public conditionType: ConditionType;
  marketAbsConditionParameters: Array<MarketAbsConditionParameter>;
  marketRelConditionParameters: Array<MarketRelConditionParameter>;
  cap: number;

  constructor() {
  }

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
