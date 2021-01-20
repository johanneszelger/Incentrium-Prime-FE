import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ProgramService} from '../../../services/program.service';
import {MessageService} from 'primeng/api';
import {ReplaySubject, Subject} from 'rxjs';

@Component({
  selector: 'inc-edit-grant-modal-wrapper',
  templateUrl: './edit-grant-modal-wrapper.component.html',
  styleUrls: ['./edit-grant-modal-wrapper.component.scss']
})
export class EditGrantModalWrapperComponent implements OnInit {
  public toEdit;

  constructor(private dialogRef: DynamicDialogRef,
              private config: DynamicDialogConfig,
              public programService: ProgramService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    if (this.config.data && this.config.data.grant) {
      this.toEdit = new ReplaySubject<Grant>();
      this.toEdit.next(this.config.data.grant);
    }
  }

  createOrSaveGrant(grant): void {
    this.dialogRef.close(grant);
  }
}
