import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BlockableUI} from 'primeng/api';

@Component({
  selector: 'inc-blockable-container',
  templateUrl: './blockable-container.component.html',
  styleUrls: ['./blockable-container.component.scss']
})
export class BlockableContainerComponent implements OnInit, BlockableUI {
  @ViewChild('content') content;

  constructor() { }

  ngOnInit(): void {
  }

  getBlockableElement(): HTMLElement {
    return this.content.nativeElement;
  }
}
