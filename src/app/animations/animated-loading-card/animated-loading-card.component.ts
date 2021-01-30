import {Component, Input, OnInit} from '@angular/core';
import {trigger} from '@angular/animations';
import {flyInForCards} from '../animations';

@Component({
  selector: 'inc-animated-loading-card',
  templateUrl: './animated-loading-card.component.html',
  styleUrls: ['./animated-loading-card.component.scss'],
  animations: [
    trigger('load', flyInForCards),
  ]
})
export class AnimatedLoadingCardComponent implements OnInit {
  @Input() loading: boolean;
  @Input() cardHeader: string;

  constructor() { }

  ngOnInit(): void {
  }

}
