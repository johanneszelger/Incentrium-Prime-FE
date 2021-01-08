import {Role} from './role.model';

export class User {
  id: number;
  companyId: number;
  username: string;
  email: string;
  role: Role;
  accountLockedByAdmin: boolean;
  accountLockedByDate: boolean;
  locked: string;
  accountLockExpiryDate: Date;
  accountExpiryDate: Date;
  activated: boolean;
  activatedText: string;

  public static fromJson(data): User {
    const u = Object.assign(new User(), data);
    u.locked = u.accountLockedByAdmin || u.accountLockedByDate ? 'Yes' : 'No';
    u.activatedText = u.activated ? 'Yes' : 'No';
    return u;
  }
}
