export class User {
  id: number;
  companyId: number;
  username: string;
  email: string;
  role: string;
  accountLockedByAdmin: boolean;
  accountLockedByDate: boolean;
  locked: string;
  accountLockExpiryDate: Date;
  accountExpiryDate: Date;

  public static fromJson(data): User {
    const u = Object.assign(new User(), data);
    u.locked = u.accountLockedByAdmin || u.accountLockedByDate ? 'Yes' : 'No';
    return u;
  }
}
