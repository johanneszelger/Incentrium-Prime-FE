import {Component, OnInit} from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';
import {AccountService} from '../services/account.service';
import {Router} from '@angular/router';

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
    this.items = [
      {
        label: 'Overview',
        icon: PrimeIcons.HOME,
        routerLink: ['']
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      }
    ];

    if (this.accountService.isAdmin() || this.accountService.isSuperAdmin()) {
      this.items.push(
        {
          label: this.accountService.isSuperAdmin() ? 'Users' : 'Users of ' + sessionStorage.getItem('company'),
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
    }
    if (this.accountService.isSuperAdmin()) {
      this.items.push(
        {
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
