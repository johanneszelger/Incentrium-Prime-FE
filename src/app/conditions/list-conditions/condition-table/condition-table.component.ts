import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Condition} from '../../../models/condition.model';
import {Grant} from '../../../models/grant.model';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'inc-condition-table',
  templateUrl: './condition-table.component.html',
  styleUrls: ['./condition-table.component.scss']
})
export class ConditionTableComponent implements OnInit {
  @Input() conditions: Array<Condition>;
  @Input() loading: boolean;

  @Output() conditionsChange: EventEmitter<Array<Condition>> = new EventEmitter();
  @Output() delete: EventEmitter<Array<Condition>> = new EventEmitter();
  @Output() copy: EventEmitter<Condition> = new EventEmitter();
  @Output() editGrant: EventEmitter<Condition> = new EventEmitter();
  @Output() add: EventEmitter<void> = new EventEmitter();

  selectedConditions: Array<Condition>;
  conditionToCopy: Condition;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  confirmDelete(condition: Condition | undefined): void {
    /*if (condition === undefined && (this.selectedConditions === undefined || !this.selectedConditions.length)) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Grants selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        key: condition === undefined ? 'deleteSelected' : condition.id.toString(),
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log('accepted');
          setTimeout(() => {
            if (condition !== undefined) {
              this.conditions =
                this.conditions.filter(c => c !== condition);
            } else {
              this.conditions =
                this.conditions.filter(g => !this.selectedConditions.includes(g));
            }
            this.conditionsChange.emit(this.conditions);
            this.delete.emit(condition !== undefined ? [condition] : this.selectedConditions);
            this.selectedConditions = new Array<Condition>();
          });
        }
      });
    }*/
  }

  copyCondition(form: NgForm, toHide: OverlayPanel): void {
    /*const grant = this.grantToCopy.clone(this.grantToCopy.programId);
    grant.id = form.value.copyId;
    const newList = new Array<Grant>();
    this.grants.forEach(g => newList.push(g));
    newList.push(grant);
    this.grants = newList;
    this.grantsChange.emit(this.grants);
    this.copy.emit(grant);
    toHide.hide();*/
  }
}
