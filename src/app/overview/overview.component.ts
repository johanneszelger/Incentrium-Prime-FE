import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {ProgramService} from '../services/program.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {Program} from '../models/program.model';

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
  private idToCopy: number;

  constructor(private programService: ProgramService,
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
            this.messageService.add({key: 'toast', severity: 'error',
              summary: 'Could not load programs', detail: ''});
          }
          this.loading = false;
        });
  }

  editEntity(rowData: any): void {
    switch (rowData.type) {
      case 'program':
        this.router.navigate(['/editprogram'],  { queryParams: { programId: rowData.id } });
    }
  }

  deleteEntity(rowData: any): void {
    switch (rowData.type) {
      case 'program':
        this.programService.delete(rowData.col1).pipe(first()).subscribe(() => this.loadListData(), error => {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete selected progam', detail: ''});
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

  copyProgram(copyForm: NgForm, toHide: OverlayPanel): void {
    this.copying = true;
    this.programService.copy(this.idToCopy, copyForm.value.copyName).subscribe(
      succ => {
        this.loadListData();
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied Program', detail: ''});
        this.copying = false;
        toHide.hide();
      },
      error =>  {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not copy Program', detail: ''});
        }
        this.copying = false;
        toHide.hide();
      },
    );
  }
}
