import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'inc-authpage',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({position: 'relative'}),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            width: '100%'
          }),
        ], { optional: true }),
        group([
          query(':enter', [
            style({
              left: '100%',
            }),
            animate('300ms ease-out', style({left: '0%'}))
          ], { optional: true }),
          query(':leave', [
            style({
              left: 0,
            }),
            animate('300ms ease-out', style({left: '-100%'}))
          ], { optional: true }),
        ])
      ]),
    ]),
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private accountService: AccountService) {
    accountService.logout(false);
  }


  ngOnInit(): void {
  }


  prepareRoute(outlet: RouterOutlet): any {
    return outlet.activatedRouteData;
  }
}
