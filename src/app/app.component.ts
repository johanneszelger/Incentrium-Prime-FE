import {Component} from '@angular/core';
import {AccountService} from './services/account.service';
import {RouterOutlet} from '@angular/router';
import {animate, query, style, transition, trigger} from '@angular/animations';
import {flyOutForRouter} from './animations/animations';
import {environment} from '../environments/environment';

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

  constructor(public accountService: AccountService) {
  }


  prepareRoute(outlet: RouterOutlet): any {
    return outlet.activatedRouteData;
  }
}
