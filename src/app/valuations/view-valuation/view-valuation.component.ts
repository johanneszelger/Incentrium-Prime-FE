import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ValuationService} from '../../services/valuation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Valuation} from '../../models/valuation.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'inc-view-valuation',
  templateUrl: './view-valuation.component.html',
  styleUrls: ['./view-valuation.component.scss']
})
export class ViewValuationComponent implements OnInit, AfterViewInit, OnDestroy {
  public loading = false;
  private paramSubscription;
  private valuationId: number;
  private valuation: Valuation;
  private programNow: any;
  private programThen: any;
  displayName: string;

  constructor(private valuationService: ValuationService,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.paramSubscription = this.route
        .queryParams
        .subscribe(params => {
          // Defaults to 0 if no query param provided.
          this.valuationId = params.valuationId;
          if (this.valuationId === undefined) {
            this.loading = false;
            this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load valuation', detail: ''});
            this.router.navigateByUrl('valuations');
            return;
          }
          this.valuationService.loadValuationWithProgram(this.valuationId)
            .pipe(finalize(() => this.loading = false)).subscribe(
              succ => {
                this.valuation = succ.valuation;
                this.programNow = succ.programNow;
                this.programThen = succ.programThen;

                if (this.programNow === null) {
                  this.displayName = this.programThen.data.col1 + ' (deleted)';
                  return;
                }
                this.displayName = this.programNow.data.col1;
                if (this.programThen !== null && this.programThen.data.col1 !== this.programNow.data.col1) {
                  this.displayName += ' (name when valuated: ' + this.programThen.data.col1 + ')';
                }
              },
              error => {
                if (error) {
                  this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Valuatuion', detail: ''});
                }
                this.router.navigateByUrl('valuations');
              });
        });
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }
}
