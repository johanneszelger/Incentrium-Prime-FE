import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
import {AccountService} from './account.service';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'inc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  credentials = {username: '', password: ''};

  constructor(private accountService: AccountService,
              private messageService: MessageService,
              private router: Router) {
    if (accountService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

  login(): void {
    this.loading = true;
    this.accountService.login(this.credentials).pipe(finalize(() => this.loading = false)).subscribe(data => {
      this.messageService.add({key: 'toast', severity: 'success', summary: 'Logged in!'});
      this.router.navigate(['']);
    }, error => {
      if (error) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not log in, please try again later'});
      }
    });
  }

  ngOnInit(): void {
  }

}
