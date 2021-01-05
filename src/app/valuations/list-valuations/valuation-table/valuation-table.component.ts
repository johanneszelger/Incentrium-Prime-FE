import {EventEmitter, Component, Input, OnInit, Output, AfterContentChecked} from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {ValuationService} from '../../../services/valuation.service';

@Component({
  selector: 'inc-valuation-table',
  templateUrl: './valuation-table.component.html',
  styleUrls: ['./valuation-table.component.scss']
})
export class ValuationTableComponent implements OnInit {
  @Input() programsWithValuations: Array<TreeNode>;

  @Output() add = new EventEmitter<void>();
  @Output() view = new EventEmitter<string>();

  constructor(private valuationService: ValuationService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    setTimeout(() => this.refreshProgress(), 5000);
  }

  refreshProgress(): void {
    this.valuationService.loadProgress().subscribe(data => {
      this.programsWithValuations.forEach(program => {
        program.children.filter(c => c.data.type === 'date').forEach(date => {
          date.children.filter(c => c.data.type === 'valuation').forEach(valuation => {
            const newProgress = data.filter(progress => progress.id === valuation.data.id)[0];
            if (newProgress) {
              valuation.data.progress = Math.round(newProgress.progress * 100);
            }
          });
        });
      });
      setTimeout(() => this.refreshProgress(), 5000);
    }, error => {
      if (error) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could refresh progress', detail: 'Please press F5 to refresh'});
      }
    });
  }
}
