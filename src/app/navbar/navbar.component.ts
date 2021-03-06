import {Component, OnInit} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';
import {environment} from "../../environments/environment";

@Component({
  selector: 'inc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[];
  username: string;

  constructor(public accountService: AccountService,
              private router: Router) {
    this.username = accountService.getUsername();
  }

  logout(): void {
    this.accountService.logout();
  }

  ngOnInit(): void {
    this.items = [];

    if (this.accountService.isUser()) {
      this.items.push({
        label: 'Nothing',
        icon: PrimeIcons.HOME,
        routerLink: ['']
      });
    } else if (this.accountService.isAdmin() || this.accountService.isSuperAdmin() || !environment.production) {
      this.items.push({
        label: 'Overview',
        icon: PrimeIcons.HOME,
        routerLink: ['']
      });
      this.items.push({
        label: 'Programs',
        icon: PrimeIcons.BOOK,
        items: [{
          label: 'List',
          icon: PrimeIcons.LIST,
          routerLink: ['programs']
        },
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            routerLink: ['createprogram']
          }]
      });
      this.items.push({
        label: 'Grants',
        icon: PrimeIcons.BOOK,
        items: [{
          label: 'List',
          icon: PrimeIcons.LIST,
          routerLink: ['grants']
        },
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            routerLink: ['creategrant']
          }]
      });
      this.items.push({
        label: 'Conditions',
        icon: PrimeIcons.CHECK_SQUARE,
        items: [{
          label: 'List',
          icon: PrimeIcons.LIST,
          routerLink: ['conditions']
        },
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            routerLink: ['createcondition']
          }]
      });
      this.items.push({
        label: 'Valuation',
        icon: PrimeIcons.CHART_LINE,
        items: [{
          label: 'List',
          icon: PrimeIcons.LIST,
          routerLink: ['valuations']
        },
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            routerLink: ['createvaluation']
          }]
      });
      this.items.push({
        label: 'Vesting',
        icon: PrimeIcons.TABLE,
        routerLink: ['vesting']
      });
      this.items.push({
        label: this.accountService.isSuperAdmin() ? 'Users' : 'Users of ' + localStorage.getItem('company'),
        icon: PrimeIcons.USER,
        items: [{
          label: 'List',
          icon: PrimeIcons.LIST,
          routerLink: ['users']
        },
          {
            label: 'New',
            icon: PrimeIcons.PLUS,
            routerLink: ['createuser']
          }]
      });
      if (this.accountService.isSuperAdmin()) {
        this.items.push({
          label: 'Companies',
          icon: PrimeIcons.USER,
          items: [{
            label: 'List',
            icon: PrimeIcons.LIST,
            routerLink: ['companies']
          },
            {
              label: 'New',
              icon: PrimeIcons.PLUS,
              routerLink: ['createcompany']
            }]
        });
      }
    }
  }
}
