import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {User} from '../../../models/user.model';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'inc-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  @Input() users: Array<User>;

  @Output() usersChange: EventEmitter<Array<User>> = new EventEmitter();

  @Output() delete: EventEmitter<Array<User>> = new EventEmitter();
  @Output() lock: EventEmitter<User> = new EventEmitter();
  @Output() resetPassword: EventEmitter<User> = new EventEmitter();
  @Output() edit: EventEmitter<User> = new EventEmitter();
  @Output() add: EventEmitter<void> = new EventEmitter();

  userToCopy: User;
  selectedUsers: any;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  confirmDelete($event: MouseEvent, user: User): void {
    if (user === undefined && (this.selectedUsers === undefined || !this.selectedUsers.length)) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Users selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        key: user === undefined ? 'deleteSelected' : user.id.toString(),
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          setTimeout(() => {
            if (user !== undefined) {
              this.users =
                this.users.filter(g => g !== user);
            } else {
              this.users =
                this.users.filter(g => !this.selectedUsers.includes(g));
            }
            this.usersChange.emit(this.users);
            this.delete.emit(user !== undefined ? [user] : this.selectedUsers);
            this.selectedUsers = new Array<Grant>();
          });
        }
      });
    }
  }
}
