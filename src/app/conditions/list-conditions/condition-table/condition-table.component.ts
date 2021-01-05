import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Condition} from '../../../models/condition.model';
import {Grant} from '../../../models/grant.model';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';

@Component({
  selector: 'inc-condition-table',
  templateUrl: './condition-table.component.html',
  styleUrls: ['./condition-table.component.scss']
})
export class ConditionTableComponent implements OnInit {
  @Input() conditions: Array<TreeNode>;

  @Output() conditionsChange: EventEmitter<Array<TreeNode>> = new EventEmitter();

  @Output() delete: EventEmitter<Array<TreeNode>> = new EventEmitter();
  @Output() edit: EventEmitter<string> = new EventEmitter();
  @Output() add: EventEmitter<void> = new EventEmitter();

  selectedConditions: Array<TreeNode>;
  conditionToCopy: Condition;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  confirmDelete(event: MouseEvent, rowNode: any): void {
    if (rowNode === undefined && (this.selectedConditions === undefined || !this.selectedConditions.length)) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Conditions selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        key: rowNode === undefined ? 'deleteSelected' : rowNode,
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          setTimeout(() => {
            if (rowNode !== undefined) {
              this.conditions =
                this.conditions.filter(c => c.data.col1 !== rowNode.node.data.col1);
            } else {
              this.conditions =
                this.conditions.filter(c => !this.selectedConditions.includes(c));
            }
            this.conditionsChange.emit(this.conditions);
            this.delete.emit(rowNode !== undefined ? [rowNode] : this.selectedConditions);
            this.selectedConditions = new Array<TreeNode>();
          });
        }
      });
    }
  }

  editCondition(rowData: any): void {
    this.edit.emit(rowData.col1);
  }
}
