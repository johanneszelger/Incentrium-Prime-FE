import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {animate,  state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'inc-magic-expander',
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        height: '*',
        opacity: '*',
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('open => closed', [
        animate('0.2s ease-in-out')
      ]),
      transition('closed => open', [
        animate('0.2s ease-in-out')
      ]),
    ]),
  ],
  templateUrl: './magic-expander.component.html',
  styleUrls: ['./magic-expander.component.scss']
})
export class MagicExpanderComponent implements OnInit {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  constructor() {
  }

  ngOnInit(): void {
  }

}
