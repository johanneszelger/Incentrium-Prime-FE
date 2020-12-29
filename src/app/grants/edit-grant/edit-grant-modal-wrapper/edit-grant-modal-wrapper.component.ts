import { Component, OnInit } from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {ProgramService} from '../../../services/program.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'inc-edit-grant-modal-wrapper',
  templateUrl: './edit-grant-modal-wrapper.component.html',
  styleUrls: ['./edit-grant-modal-wrapper.component.scss']
})
export class EditGrantModalWrapperComponent implements OnInit {

  constructor(private dialogRef: DynamicDialogRef,
              private programService: ProgramService,
              private messageService: MessageService) { }

  ngOnInit(): void {
  }

  createGrant(grant: Grant): void {
    this.dialogRef.close();
    this.programService.currentProgram.grants.push(grant);
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Grant was added to Program', detail: ''});
  }
}
