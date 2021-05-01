import {ConditionType} from './conditionType.model';
import {Grant} from './grant.model';

export class Condition {
  public id: number;
  public companyId: number;
  public name: string;
  public programVisibilityId: number;
  public programName: string;
  public conditionType: ConditionType;
  marketAbsConditionParameters = new Array<MarketAbsConditionParameter>();
  marketRelConditionParameters = new Array<MarketRelConditionParameter>();
  serviceConditionParameters = new Array<ServiceConditionParameter>();
  cap: number;
  inherited = false;

  static fromJson(data): Condition {
    const c = Object.assign(new Condition(), data);

    const jsonAbsParameters = c.marketAbsConditionParameters;
    c.marketAbsConditionParameters = [];
    jsonAbsParameters.forEach(jsonAbsParameter => {
      c.marketAbsConditionParameters.push(Object.assign(new MarketAbsConditionParameter(), jsonAbsParameter));
    });

    const jsonRelParameters = c.marketRelConditionParameters;
    c.marketRelConditionParameters = [];
    jsonRelParameters.forEach(jsonRelParameter => {
      c.marketRelConditionParameters.push(Object.assign(new MarketRelConditionParameter(), jsonRelParameter));
    });

    const jsonServiceParameters = c.serviceConditionParameters;
    c.serviceConditionParameters = [];
    jsonServiceParameters.forEach(jsonServiceParameter => {
      c.serviceConditionParameters.push(Object.assign(new ServiceConditionParameter(), jsonServiceParameter));
    });
    return c;
  }
}
export class MarketAbsConditionParameter {
  static indexCounter = 0;
  absValue: number; grantFraction: number; index: number;

  constructor() {
    this.index = MarketRelConditionParameter.indexCounter;
    MarketRelConditionParameter.indexCounter++;
  }
}
export class MarketRelConditionParameter {
  static indexCounter = 0;
  relValue: number; grantFraction: number; index: number;

  constructor() {
    this.index = MarketRelConditionParameter.indexCounter;
    MarketRelConditionParameter.indexCounter++;
  }
}
export class ServiceConditionParameter {
  static indexCounter = 0;
  monthsAfterStart: number; grantFraction: number; index: number;

  constructor() {
    this.index = ServiceConditionParameter.indexCounter;
    ServiceConditionParameter.indexCounter++;
  }
}
