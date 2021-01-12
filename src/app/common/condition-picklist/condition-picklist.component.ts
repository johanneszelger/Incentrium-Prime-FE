import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {Program} from '../../models/program.model';
import {Condition} from '../../models/condition.model';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ProgramService} from '../../services/program.service';
import {ConditionService} from '../../services/condition.service';

@Component({
  selector: 'inc-condition-picklist',
  templateUrl: './condition-picklist.component.html',
  styleUrls: ['./condition-picklist.component.scss']
})
export class ConditionPicklistComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() programId: number;
  @Input() targetObject: Grant | Program;
  @Input() outsideLoading = false;

  initialized = false;
  loadingConditions = false;
  availableConditions = new Array<Condition>();
  filteredConditions = new Array<Condition>();

  constructor(private messageService: MessageService,
              private conditionService: ConditionService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.initialized) {
      this.loadConditions();
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    this.loadConditions();
  }

  filterAvailableConditions(items: Array<Condition>): void {
    const toRemove = new Array<Condition>();
    items.forEach(item => {
      this.availableConditions.filter(cond => cond.conditionType.startsWith(item.conditionType.substr(0, 3))).forEach(cond => {
        this.filteredConditions.push(cond);
        toRemove.push(cond);
      });
    });
    this.availableConditions = this.availableConditions.filter(c => !toRemove.includes(c));
    this.sortAvailableConditions();
  }

  private loadConditions(): void {
    this.loadingConditions = true;
    this.conditionService.getAvailableConditions(this.programId)
      .pipe(finalize(() => this.loadingConditions = false)).subscribe(res => {
      this.availableConditions = res;
      this.filterAvailableConditions(this.targetObject.conditions);
      this.sortAvailableConditions();
    }, err => {
      if (err) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load conditions', detail: ''});
      }
    });
  }

  reAddAvailableConditions(items: Array<Condition>): void {
    const toRemove = new Array<Condition>();
    items.forEach(item => {
      this.filteredConditions.filter(cond => cond.conditionType.startsWith(item.conditionType.substr(0, 3))).forEach(cond => {
        this.availableConditions.push(cond);
        toRemove.push(cond);
      });
    });
    this.filteredConditions = this.filteredConditions.filter(c => !toRemove.includes(c));
    this.sortAvailableConditions();
  }

  private sortAvailableConditions(): void {
    this.availableConditions = this.availableConditions.sort((a, b) => a.name > b.name ? 1 : -1);
  }
}
