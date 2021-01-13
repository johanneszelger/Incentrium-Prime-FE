import {EventEmitter, Component, Input, OnInit, Output, AfterContentChecked} from '@angular/core';
import {MessageService, TreeNode} from 'primeng/api';
import {ValuationService} from '../../../services/valuation.service';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'inc-valuation-table',
  templateUrl: './valuation-table.component.html',
  styleUrls: ['./valuation-table.component.scss']
})
export class ValuationTableComponent implements OnInit {
  REFRESH_EVERY = 5000;

  @Input() programsWithValuations: Array<TreeNode>;

  @Output() add = new EventEmitter<void>();
  @Output() view = new EventEmitter<string>();

  constructor(private valuationService: ValuationService,
              private messageService: MessageService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    setTimeout(() => this.refreshProgress(), this.REFRESH_EVERY);
  }

  refreshProgress(): void {
    console.log('refresh');
    if (!this.programsWithValuations) {
      setTimeout(() => this.refreshProgress(), this.REFRESH_EVERY);
      return;
    }

    if (!this.accountService.isAuthenticated()) {
      return;
    }

    this.valuationService.loadProgress().subscribe(data => {
      let needToRefreshAgain = false;
      this.programsWithValuations.forEach(program => {
        program.children.filter(c => c.data.type === 'date').forEach(date => {
          date.children.filter(c => c.data.type === 'valuation').forEach(valuation => {
            const newProgress = data.filter(progress => progress.id === valuation.data.id)[0];
            if (newProgress) {
              valuation.data.progress = Math.round(newProgress.progress * 100);
              if (newProgress.progress !== 1 && newProgress.progress >= 0) {
                needToRefreshAgain = true;
              }
              if (valuation.data.progress === 100 && valuation.data.pv === undefined) {
                this.fetchSummedPV(valuation.data);
              }
            }
          });
        });
      });
      if (needToRefreshAgain) {
        setTimeout(() => this.refreshProgress(), this.REFRESH_EVERY);
      }
    }, error => {
      if (error) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could refresh progress', detail: 'Please press F5 to refresh'});
      }
    });
  }

  fetchSummedPV(data): void {
    this.valuationService.loadValuation(data.id).subscribe(val => {
      const program = this.programsWithValuations.filter(node => node.data.id === data.programId)[0];
      const date = program.children.filter(node => node.data.col1 === data.date)[0];
      const valuation = date.children.filter(node => node.data.id === data.id)[0];
      valuation.data.pv = val.valuatedGrants.reduce((sum: number, g) => g.summedPv, 0);
    });
  }
}
