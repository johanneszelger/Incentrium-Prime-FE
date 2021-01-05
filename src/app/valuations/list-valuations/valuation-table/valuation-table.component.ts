import {EventEmitter, Component, Input, OnInit, Output} from '@angular/core';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'inc-valuation-table',
  templateUrl: './valuation-table.component.html',
  styleUrls: ['./valuation-table.component.scss']
})
export class ValuationTableComponent implements OnInit {
  @Input() programsWithValuations: Array<TreeNode>;

  @Output() add = new EventEmitter<void>();
  @Output() view = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
}
