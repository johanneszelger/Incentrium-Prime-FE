import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgramService} from '../../services/program.service';
import {first, timeout} from 'rxjs/operators';
import {Program} from '../../models/program.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Grant} from '../../models/grant.model';
import {AbstractControl, NgForm, ValidatorFn} from '@angular/forms';
import {ProgramType} from '../../models/programType.model';
import {DialogService} from 'primeng/dynamicdialog';
import {EditGrantForm} from '../../grants/edit-grant/edit-grant-form.component';
import {EditGrantModalWrapperComponent} from '../../grants/edit-grant/edit-grant-modal-wrapper/edit-grant-modal-wrapper.component';
import {OverlayPanel} from 'primeng/overlaypanel';

@Component({
  selector: 'inc-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.scss']
})
export class EditProgramComponent implements OnInit, OnDestroy{
  private paramSubscription;
  private programId: string;
  private programTypeEnum = ProgramType;
  selectedGrants: Grant[];
  editMode = false;
  loading = true;
  saving: any;
  grantToCopy: Grant;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.route.snapshot.paramMap.get('bank');
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.programId = params.programId || '';
        if ('' === this.programId) {
          this.loading = false;
          this.programService.resetCurrentProgram();
          return;
        }
        this.programService.getAvailableConditions(this.programId).subscribe();
        this.programService.loadProgram(this.programId).pipe(first()).subscribe(
          program => {
            this.editMode = true;
            this.loading = false;
          },
            error => {
              if (error) {
                this.messageService.add({severity: 'error', summary: 'Could not load program', detail: ''});
              }
              this.router.navigate(['programs']);
            });
      });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  public submitProgram(form: NgForm): void {
    this.saving = true;
    this.programService.save(this.programService.currentProgram, this.editMode)
      .pipe(first())
      .subscribe(
        data => {
          this.saving = false;
          this.router.navigate(['/programs']);
        },
        error => {
          if (error) {
            this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not save program', detail: ''});
          }
          this.saving = false;
        });
  }

  updateGrantProgramIds(): void{
    this.programService.currentProgram.grants.forEach((g) => g.programId = this.programService.currentProgram.id);
  }

  confirmDeleteSingle($event: MouseEvent, grant: Grant): void {
    this.confirmationService.confirm({
      key: grant.id,
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setTimeout(() => this.programService.currentProgram.grants
          = this.programService.currentProgram.grants.filter(g => g !== grant), 100);
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted selected Grant', detail: ''});
      }
    });
  }

  confirmDeleteSelection(): void {
    console.log(this.selectedGrants);
    if (this.selectedGrants === undefined || !this.selectedGrants.length) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Grants selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.programService.currentProgram.grants =
            this.programService.currentProgram.grants.filter(g => !this.selectedGrants.includes(g));
          this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted selected Grants', detail: ''});
        }
      });
    }
  }

  showAddGrantDialog(): void {
    this.showEditGrantDialog(undefined);
  }

  copyGrant(copyForm: NgForm, toHide: OverlayPanel): void {
    const grant = this.grantToCopy.clone(this.programService.currentProgram.id);
    grant.id = copyForm.value.copyId;
    this.programService.currentProgram.grants.push(grant);
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied Grant', detail: ''});
    toHide.hide();
  }

  showEditGrantDialog(toEdit: Grant | undefined): void {
    this.programService.getAvailableConditions(this.programId).subscribe(
      success => {
        const ref = this.dialogService.open(EditGrantModalWrapperComponent, {
          data: {
            grant: toEdit
          },
          showHeader: true,
          header: toEdit === undefined ? 'Create new Grant' : 'Edit Grant',
          width: '90%',
          styleClass: 'overflowable-dialog'
        });
      },
      error => {
        if (error) {
          this.messageService
            .add({
              key: 'toast',
              severity: 'errror',
              summary: 'Could not load available conditions, cannot edit Grant',
              detail: ''
            });
        }
      }
    );
  }
}
