import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import {AccountService} from '../../services/account.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'inc-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.scss']
})
export class RequestResetComponent implements OnInit {
  saving = false;
  email: string;

  constructor(private messageService: MessageService,
              private router: Router,
              private accountService: AccountService) { }

  ngOnInit(): void {
  }

  requestReset(): void {
    this.saving = true;
    this.accountService.requestReset(this.email).pipe(finalize(() => this.saving = false)).subscribe(
      succ => {
        this.router.navigateByUrl('');
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Password reset requested',
          detail: 'Please check your email to find a reset link', life: 5000});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Request failed',
            detail: 'Please try again later'});
        }
      }
    );
  }
}
