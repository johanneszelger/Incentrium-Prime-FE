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
  @Input() showProgramName = true;

  @Output() grantsChange: EventEmitter<Array<Grant>> = new EventEmitter();

  @Output() delete: EventEmitter<Array<Grant>> = new EventEmitter();
  @Output() copy: EventEmitter<Grant> = new EventEmitter();
  @Output() edit: EventEmitter<Grant> = new EventEmitter();
  @Output() add: EventEmitter<void> = new EventEmitter();

  selectedGrants: Array<Grant>;
  grantToCopy: Grant;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  confirmDelete(event: MouseEvent, grant: Grant | undefined): void {
    if (grant === undefined && (this.selectedGrants === undefined || !this.selectedGrants.length)) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Grants selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        key: grant === undefined ? 'deleteSelected' : grant.getKey(),
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
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
    const grant = this.grantToCopy.clone();
    grant.name = form.value.copyName;
    const newList = new Array<Grant>();
    this.grants.forEach(g => newList.push(g));
    newList.push(grant);
    this.grants = newList;
    this.grantsChange.emit(this.grants);
    this.copy.emit(grant);
    toHide.hide();
  }
}
