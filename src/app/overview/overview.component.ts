import {Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {ProgramService} from '../services/program.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {CopyProgramComponent} from '../programs/copy-program/copy-program.component';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'inc-list-programs',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  programTreeNodes: TreeNode[];
  cols: any[];
  loading: boolean;

  constructor(private programService: ProgramService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.loadListData();
  }

  loadListData(): void {
    this.loading = true;
    this.programService.listAsTreeNode()
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.programTreeNodes = data;
        },
        error => {
          this.messageService.add({key: 'toast', severity: 'error',
            summary: 'Servers are currently offline. Please try again later', detail: ''});
          this.loading = false;
        });
  }

  editEntity(rowData: any): void {
    switch (rowData.type) {
      case 'program':
        this.router.navigate(['/editprogram'],  { queryParams: { programId: rowData.col1 } });
    }
  }

  copyEntity(rowData: any): void {
    switch (rowData.type) {
      case 'program':
        console.error('not implemented');
    }
  }

  deleteEntity(rowData: any): void {
    switch (rowData.type) {
      case 'program':
        this.programService.delete(rowData.col1).pipe(first()).subscribe(() => this.loadListData(), error => {
          this.messageService.add({severity: 'error', summary: 'Could not delete selected progam', detail: ''});
          this.loading = false;
        });
    }
  }

  confirmDelete(event: Event, rownode, rowdata): void {
    this.confirmationService.confirm({
      key: rownode,
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.deleteEntity(rowdata);
      }
    });
  }
}
