import { Component, OnInit } from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ProgramService} from '../../../services/program.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'inc-edit-grant-modal-wrapper',
  templateUrl: './edit-grant-modal-wrapper.component.html',
  styleUrls: ['./edit-grant-modal-wrapper.component.scss']
})
export class EditGrantModalWrapperComponent implements OnInit {
  public toEdit: Grant;

  constructor(private dialogRef: DynamicDialogRef,
              private config: DynamicDialogConfig,
              public programService: ProgramService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    if (this.config.data && this.config.data.grant) {
      this.toEdit = this.config.data.grant;
    }
  }

  createOrSaveGrant(grant: Grant): void {
    this.dialogRef.close();
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Grant was added to Program', detail: ''});
  }
}
