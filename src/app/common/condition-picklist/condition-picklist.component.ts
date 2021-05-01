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
  @Input() inheritedConditions = new Array<Condition>();

  initialized = false;
  loadingConditions = false;
  availableConditions = new Array<Condition>();
  selectedConditions = new Array<Condition>();
  filteredTypeConditions = new Array<Condition>();

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

  private loadConditions(): void {
    this.loadingConditions = true;
    setTimeout(() => {
      this.conditionService.getAvailableConditions(this.programId)
        .pipe(finalize(() => this.loadingConditions = false)).subscribe(res => {
        this.availableConditions = res;
        this.filteredTypeConditions = [];

        this.filterConditionsAfterLoading();
      }, err => {
        if (err) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load conditions', detail: ''});
        }
      });
    });
  }

  filterConditionsAfterLoading(): void {
    this.inheritedConditions.forEach(c => c.inherited = true);

    if (this.targetObject instanceof Program) {
      this.availableConditions = this.availableConditions
        .filter(c => c.programVisibilityId === null || c.programVisibilityId === this.targetObject.id);
    }

    this.targetObject.conditions = this.targetObject.conditions
      .filter(c => this.availableConditions.filter(ac => ac.id === c.id).length > 0);

    this.selectedConditions = [];
    this.targetObject.conditions.forEach(c => this.selectedConditions.push(c));
    this.inheritedConditions.forEach(c => this.selectedConditions.push(c));

    this.availableConditions = this.availableConditions
      .filter(c => this.selectedConditions.filter(tc => tc.id === c.id).length === 0);

    this.filterAvailableByType(this.targetObject.conditions);
  }

  addedCondition(items: Condition[]): void {
    this.filterAvailableByType(items);
    items.forEach(c => this.targetObject.conditions.push(c));
  }

  removedCondition(items: Condition[]): void {
    items.filter(c => c.inherited).forEach(c => {
      this.selectedConditions.push(c);
      this.availableConditions = this.availableConditions.filter(ac => ac.id !== c.id);
    });
    items = items.filter(c => !c.inherited);
    this.reAddTypeFilteredConditions(items);
    this.targetObject.conditions = this.targetObject.conditions.filter(c => items.indexOf(c) < 0);
  }

  filterAvailableByType(items: Array<Condition>): void {
    const toRemove = new Array<Condition>();
    items.forEach(item => {
      // for non performance conditions only one with the same type is allowed
      if (!item.conditionType.startsWith('Performance')) {
        this.availableConditions
          .filter(cond => cond.conditionType.startsWith(item.conditionType.substr(0, 3))).forEach(cond => {
          this.filteredTypeConditions.push(cond);
          toRemove.push(cond);
        });
      }
    });
    this.availableConditions = this.availableConditions.filter(c => !toRemove.includes(c));
    this.sortConditions();
  }

  reAddTypeFilteredConditions(items: Array<Condition>): void {
    const toRemove = new Array<Condition>();
    items.forEach(item => {
      this.filteredTypeConditions.filter(cond => cond.conditionType.startsWith(item.conditionType.substr(0, 3))).forEach(cond => {
        this.availableConditions.push(cond);
        toRemove.push(cond);
      });
    });
    this.filteredTypeConditions = this.filteredTypeConditions.filter(c => !toRemove.includes(c));
    this.sortConditions();
  }

  private sortConditions(): void {
    this.selectedConditions = this.selectedConditions.sort((a, b) => {
      if (a.inherited && b.inherited) {
        return a.name > b.name ? 1 : -1;
      }
      return (b.inherited ? 1 : 0) - (a.inherited ? 1 : 0);
    });
    this.availableConditions = this.availableConditions.sort((a, b) => a.name > b.name ? 1 : -1);
  }
}
