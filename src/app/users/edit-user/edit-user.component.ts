import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from '../../models/user.model';
import {Role} from '../../models/role.model';
import {YearService} from '../../services/year.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {AccountService} from '../../auth/login/account.service';
import {Company} from '../../models/company.model';
import {finalize} from 'rxjs/operators';
import {CompanyService} from '../../services/company.service';

@Component({
  selector: 'inc-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, AfterViewInit {
  loading = false;
  editMode = false;
  userId: number;
  user = new User();
  roleEnum;
  saving = false;
  companies = new Array<Company>();
  private paramSubscription;

  constructor(public accountService: AccountService,
              public yearService: YearService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private companyService: CompanyService) { }

  ngOnInit(): void {
    this.roleEnum = Role;
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.userId = params.userId;
        if (this.userId === undefined) {
          this.loadPrograms();
          return;
        }
        this.userService.loadUser(this.userId).subscribe(
          user => {
            this.user = user;
            this.editMode = true;
            this.loadPrograms();
          },
          error => {
            if (error) {
              this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load user', detail: ''});
            }
            this.router.navigate(['users']);
          });
      });
  }

  submitUser(): void {
    this.saving = true;
    this.userService.save(this.user, this.editMode).pipe(finalize(() => this.saving = false)).subscribe(user => {
        this.messageService.add({
          key: 'toast',
          severity: 'success',
          summary: this.editMode ? 'Saved user' : 'Registered user',
          detail: this.editMode ? '' : `The user will get an activation email sent to ${user.email}`,
          life: 5000
        });
        this.router.navigate(['users']);
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not register user', detail: ''});
        }
      });
  }

  private loadPrograms(): void {
    if (this.accountService.isSuperAdmin()) {
      this.companyService.list().pipe(finalize(() => this.loading = false))
        .subscribe( companies => this.companies = companies,
          error => {
            if (error) {
              this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load companies', detail: ''});
            }
          });
    } else {
      this.loading = false;
    }
  }
}
