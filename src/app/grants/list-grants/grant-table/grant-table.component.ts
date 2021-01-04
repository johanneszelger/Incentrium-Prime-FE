import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'inc-grant-table',
  templateUrl: './grant-table.component.html',
  styleUrls: ['./grant-table.component.scss']
})
export class GrantTableComponent implements OnInit {
  @Input() grants: Array<Grant>;
  @Input() showProgramId = true;

  @Output() grantsChange: EventEmitter<Array<Grant>> = new EventEmitter();
  @Output() delete: EventEmitter<Array<Grant>> = new EventEmitter();
  @Output() copy: EventEmitter<Grant> = new EventEmitter();
  @Output() editGrant: EventEmitter<Grant> = new EventEmitter();
  @Output() add: EventEmitter<void> = new EventEmitter()

  selectedGrants: Array<Grant>;
  grantToCopy: Grant;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  confirmDelete(grant: Grant | undefined): void {
    if (grant === undefined && (this.selectedGrants === undefined || !this.selectedGrants.length)) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Grants selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        key: grant === undefined ? 'deleteSelected' : grant.id,
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          console.log('accepted');
          setTimeout(() => {
            if (grant !== undefined) {
              this.grants =
                this.grants.filter(g => g !== grant);
            } else {
              this.grants =
                this.grants.filter(g => !this.selectedGrants.includes(g));
            }
            this.grantsChange.emit(this.grants);
            this.delete.emit(grant !== undefined ? [grant] : this.selectedGrants);
            this.selectedGrants = new Array<Grant>();
          });
        }
      });
    }
  }

  copyGrant(form: NgForm, toHide: OverlayPanel): void {
    const grant = this.grantToCopy.clone(this.grantToCopy.programId);
    grant.id = form.value.copyId;
    const newList = new Array<Grant>();
    this.grants.forEach(g => newList.push(g));
    newList.push(grant);
    this.grants = newList;
    this.grantsChange.emit(this.grants);
    this.copy.emit(grant);
    toHide.hide();
  }
}
