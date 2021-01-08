import {Role} from './role.model';

export class Company {
  id: number;
  companyName: string;

  public static fromJson(data): Company {
    const u = Object.assign(new Company(), data);
    return u;
  }
}
