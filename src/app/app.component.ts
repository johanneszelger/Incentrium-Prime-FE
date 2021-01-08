import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AccountService} from './services/account.service';

@Component({
  selector: 'inc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Incentrium';

  constructor(private accountService: AccountService) {
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }
}
