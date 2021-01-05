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
  }

  static fromJson(data): Valuation {
    const c = Object.assign(new Valuation(), data);
    return c;
  }
}
