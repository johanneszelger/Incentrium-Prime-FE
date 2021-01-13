import {ExerciseType} from './exerciseType.model';

export class Valuation {
  public id: number;
  public progress: number;
  public businessDate: Date;
  public valuationDate: Date;
  public exerciseType: ExerciseType;
  public programId: string;
  public stockPrice: number;
  public riskFreeInterest: number;
  public volatility: number;
  public expectedDividendYield: number;
  public exercisePrice: number;
  public targetRoi: number;
  public timeMs: number;
  valuatedGrants: any;

  constructor() {
    this.stockPrice = 10.;
    this.riskFreeInterest = -0.45;
    this.volatility = 40;
    this.exerciseType = ExerciseType.PERFORMANCE_DEPENDING;
    this.businessDate = new Date('2020-09-30');
    this.exercisePrice = 10.;
    this.expectedDividendYield = 10.;
    this.targetRoi = 50;
  }

  static fromJson(data): Valuation {
    const c = Object.assign(new Valuation(), data);
    return c;
  }
}
