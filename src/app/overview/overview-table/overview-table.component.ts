import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {ConfirmationService, TreeNode} from 'primeng/api';
import {Tree} from 'primeng/tree';
import {CompanyService} from '../../services/company.service';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {Grant} from '../../models/grant.model';

@Component({
  selector: 'inc-overview-table',
  templateUrl: './overview-table.component.html',
  styleUrls: ['./overview-table.component.scss']
})
export class OverviewTableComponent implements OnInit {
  @Input() programTreeNodes: TreeNode[];
  @Input() showControls = true;
  @Input() copying = false;

  @Output() programTreeNodesChange: EventEmitter<TreeNode[]> = new EventEmitter();
  @Output() copyingChange: EventEmitter<boolean> = new EventEmitter();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() copyEntity = new EventEmitter<any>();

  toCopy: any;

  constructor(private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
  }

  confirmDelete(event: Event, rownode, rowdata): void {
    this.confirmationService.confirm({
      key: rownode,
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.delete.emit(rowdata);
      }
    });
  }
}
