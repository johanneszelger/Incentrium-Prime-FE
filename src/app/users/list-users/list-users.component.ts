import {AfterViewInit, Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {MessageService} from 'primeng/api';
import {UserService} from '../../services/user.service';
import {Grant} from '../../models/grant.model';
import {Router} from '@angular/router';
import {unwrapConstructorDependencies} from '@angular/compiler-cli/src/ngtsc/annotations/src/util';

@Component({
  selector: 'inc-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, AfterViewInit{
  users: Array<User>;
  loading = false;

  constructor(private userService: UserService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.userService.list().subscribe(
      data => {
        this.users = data;
        this.loading = false;
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load users', detail: ''});
        }
        this.loading = false;
      }
    );
  }

  deleteUsers(users: Array<User>): void {
    this.userService.delete(users.map(u => u.id)).subscribe(
      data => {
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted User(s)', detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete User(s)', detail: ''});
        }
        const newArray = new Array<User>();
        this.users.forEach(u => newArray.push(u));
        users.forEach(u => newArray.push(u));
        this.users = newArray;
      }
    );
  }

  editUser(user: User = new User()): void {
    this.router.navigate(['/edituser/'],  { queryParams: { userId: user.id } });
  }

  lockUser(user: User): void {
    const currentLocked = user.accountLockedByDate || user.accountLockedByAdmin;
    const msg = !currentLocked ? 'L' : 'Unl';
    const err = !currentLocked ? 'un' : '';
    this.userService.lockUnlock(user.id).subscribe(
      updatedUser => {
        this.messageService.add({key: 'toast', severity: 'success', summary: msg + 'ocked User', detail: ''});
        user.accountLockedByAdmin = updatedUser.accountLockedByAdmin;
        user.accountLockedByDate = updatedUser.accountLockedByDate;
        user.accountLockExpiryDate = updatedUser.accountLockExpiryDate;
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not ' + err + 'lock User', detail: ''});
        }
      }
    );
  }

  resetPassword(user: User): void {
    this.userService.resetPassword(user.id).subscribe(
      updatedUser => {
        this.messageService.add({key: 'toast', severity: 'success', summary: `Reset ${updatedUser.username}'s password`, detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could reset password', detail: ''});
        }
      }
    );
  }
}
