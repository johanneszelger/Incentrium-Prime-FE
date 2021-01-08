import {Role} from './role.model';

export class Company {
  id: number;
  name: string;
  logo: string;
  grantLimit: number;

  public static fromJson(data): Company {
    const u = Object.assign(new Company(), data);
    return u;
  }
}
