import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {ProgramService} from '../services/program.service';
import {finalize, first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {Program} from '../models/program.model';
import {GrantService} from '../services/grant.service';
import {Grant} from '../models/grant.model';

@Component({
  selector: 'inc-list-programs',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {
  programTreeNodes: TreeNode[];
  cols: any[];
  loading = false;
  private copying = false;
  toCopy: any;

  constructor(private programService: ProgramService,
              private grantService: GrantService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    setTimeout(() => this.loadListData(), 10);
  }

  loadListData(): void {
    this.loading = true;
    this.programService.listAsTreeNode()
      .subscribe(
        data => {
          this.loading = false;
          this.programTreeNodes = data;
        },
        error => {
          if (error) {
            this.messageService.add({
              key: 'toast', severity: 'error',
              summary: 'Could not load programs', detail: ''
            });
          }
          this.loading = false;
        });
  }

  editEntity(rowData: any): void {
    switch (rowData.type) {
      case 'program':
        this.router.navigate(['/editprogram'], {queryParams: {programId: rowData.id}});
        break;
      case 'grant':
        this.router.navigate(['/editgrant'], {queryParams: {grantId: rowData.id}});
        break;
      case 'condition':
        this.router.navigate(['/editcondition'], {queryParams: {conditionId: rowData.id}});
        break;
    }
  }

  deleteEntity(rowData: any): void {
    switch (rowData.type) {
      case 'program':
        this.programService.delete([rowData.id]).subscribe(() => {
          this.programTreeNodes = this.programService.deleteProgramFromTree(this.programTreeNodes, rowData.id);
          this.loading = false;
          this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted the selected Progam', detail: ''});
        }, error => {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete the selected Progam', detail: ''});
          this.loading = false;
        });
        break;
      case 'grant':
        this.grantService.delete([rowData.id]).subscribe(() => {
          this.programTreeNodes = this.programService.deleteGrantFromTree(this.programTreeNodes, rowData.id);
          this.loading = false;
          this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted the selected Grant', detail: ''});
        }, error => {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete the selected Grant', detail: ''});
          this.loading = false;
        });
        break;
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

  copyEntity(form: NgForm, copyOp: OverlayPanel): void {
    this.copying = true;
    switch (this.toCopy.type) {
      case 'program':
        this.copyProgram(form, copyOp);
        break;
      case 'grant':
        this.copyGrant(form, copyOp);
        break;
    }
  }

  copyProgram(copyForm: NgForm, toHide: OverlayPanel): void {
    this.programService.copy(this.toCopy.id, copyForm.value.copyNameProgram).subscribe(
      succ => {
        this.loadListData();
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied and saved Program', detail: ''});
        this.copying = false;
        toHide.hide();
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not copy Program', detail: ''});
        }
        this.copying = false;
        toHide.hide();
      },
    );
  }

  copyGrant(copyForm: NgForm, toHide: OverlayPanel): void {
    this.grantService.copy(this.toCopy.id, copyForm.value.copyNameGrant).pipe(finalize(() => this.copying = false)).subscribe(
      data => {
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied and saved Grant', detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not copy Grant', detail: ''});
        }
      }
    );
  }
}
