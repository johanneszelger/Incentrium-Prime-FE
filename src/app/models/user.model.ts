import {Role} from './role.model';

export class User {
  id: number;
  companyId: number;
  username: string;
  email: string;
  role: Role;
  locked: string;
  accountLockExpiryDate: Date;
  accountExpiryDate: Date;
  activatedText: string;

  // tslint:disable-next-line:variable-name
  private _accountLockedByAdmin: boolean;
  // tslint:disable-next-line:variable-name
  _accountLockedByDate: boolean;
  // tslint:disable-next-line:variable-name
  _activated: boolean;

  get accountLockedByAdmin(): boolean {
    return this._accountLockedByAdmin;
  }
  set accountLockedByAdmin(value: boolean) {
    this._accountLockedByAdmin = value;
    this.locked = this.accountLockedByAdmin || this.accountLockedByDate ? 'Yes' : 'No';
  }
  get accountLockedByDate(): boolean {
    return this._accountLockedByDate;
  }
  set accountLockedByDate(value: boolean) {
    this._accountLockedByDate = value;
    this.locked = this.accountLockedByAdmin || this.accountLockedByDate ? 'Yes' : 'No';
  }
  get activated(): boolean {
    return this._activated;
  }

  set activated(value: boolean) {
    this._activated = value;
    this.activatedText = this.activated ? 'Yes' : 'No';
  }

  public static fromJson(data): User {
    const u = Object.assign(new User(), data);
    return u;
  }
}
