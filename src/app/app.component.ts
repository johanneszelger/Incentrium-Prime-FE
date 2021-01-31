import {Component} from '@angular/core';
import {AccountService} from './services/account.service';
import {RouterOutlet} from '@angular/router';
import {animate, query, style, transition, trigger} from '@angular/animations';
import {flyOutForRouter} from './animations/animations';

@Component({
  selector: 'inc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', flyOutForRouter)
  ]
})

export class AppComponent {
  title = 'Incentrium';

  constructor(private accountService: AccountService) {
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  prepareRoute(outlet: RouterOutlet): any {
    return outlet.activatedRouteData;
  }
}
