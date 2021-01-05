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
  public expectedRoi: number;
  public exercisePrice: number;
  public targetRoi: number;

  constructor() {
    this.stockPrice = 10.;
    this.riskFreeInterest = -0.45 / 100.;
    this.volatility = 40 / 100.;
    this.exerciseType = ExerciseType.EARLIEST;
    this.businessDate = new Date('March 31, 2020');
    this.exercisePrice = 10.;
    this.expectedRoi = 10.;
    this.targetRoi = 10.;
  }

  static fromJson(data): Valuation {
    const c = Object.assign(new Valuation(), data);
    return c;
  }
}
