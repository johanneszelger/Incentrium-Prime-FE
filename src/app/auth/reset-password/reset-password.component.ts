import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../services/account.service';
import {setupTestingRouter} from '@angular/router/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'inc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  code: string;
  password: string;
  passwordRepeat: string;
  saving = false;
  private paramSubscription: any;

  constructor(private accountService: AccountService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        this.code = params.code;
        if (this.code === undefined || this.code === '') {
          this.router.navigateByUrl('login');
        }
      });
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.accountService.checkCodeValid(this.code).pipe(finalize(() => this.loading = false)).subscribe(res => {
      if (!res) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Link invalid',
          detail: 'The link you clicked is no longer valid, please request a new one', life: 5000});
        this.router.navigateByUrl('login');
      }
    }, err => this.router.navigateByUrl('login'));
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  resetPassword(): void {
    this.saving = true;
    this.accountService.resetPassword(this.code, this.password).pipe(finalize(() => this.saving = false)).subscribe(
      () => this.router.navigateByUrl(''),
      err => {
        if (err) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Reset failed',
            detail: 'Resetting password failed, please try again later', life: 5000});
        }
      }
    );
  }
}
