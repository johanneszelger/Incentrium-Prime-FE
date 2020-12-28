import { Component, OnInit } from '@angular/core';
import {MenuItem, PrimeIcons} from 'primeng/api';

@Component({
  selector: 'inc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    this.items = [
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
          routerLink: ['editprogram']
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
          icon: PrimeIcons.PLUS
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
          icon: PrimeIcons.PLUS
        }]
      }
    ];
  }

}
