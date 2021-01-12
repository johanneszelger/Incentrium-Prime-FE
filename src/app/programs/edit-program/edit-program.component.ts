import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgramService} from '../../services/program.service';
import {catchError, first, timeout} from 'rxjs/operators';
import {Program} from '../../models/program.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Grant} from '../../models/grant.model';
import {AbstractControl, NgForm, ValidatorFn} from '@angular/forms';
import {ProgramType} from '../../models/programType.model';
import {DialogService} from 'primeng/dynamicdialog';
import {EditGrantModalWrapperComponent} from '../../grants/edit-grant/edit-grant-modal-wrapper/edit-grant-modal-wrapper.component';
import {OverlayPanel} from 'primeng/overlaypanel';

@Component({
  selector: 'inc-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.scss']
})
export class EditProgramComponent implements OnInit, AfterViewInit, OnDestroy {
  private paramSubscription;
  private programId: number;
  programTypeEnum = ProgramType;
  editMode = false;
  loading = false;
  saving: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public programService: ProgramService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.programId = params.programId;
        if (this.programId === undefined) {
          this.loading = false;
          this.programService.resetCurrentProgram();
          return;
        }
        this.programService.getAvailableConditions(this.programId).subscribe();
        this.programService.loadProgram(this.programId).subscribe(
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
          this.messageService.add({
            key: 'toast',
            severity: 'success',
            summary: (this.editMode ? 'Saved' : 'Created') + ' Program',
            detail: ''
          });
        },
        error => {
          if (error) {
            this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not save Program', detail: ''});
          }
          this.saving = false;
        });
  }

  updateGrantProgramIds(): void {
    this.programService.currentProgram.grants.forEach((g) => g.programId = this.programService.currentProgram.id);
  }

  deleteGrants(grants: Array<Grant>): void {
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted selected Grants', detail: ''});
  }

  showAddGrantDialog(): void {
    this.showEditGrantDialog(undefined);
  }

  copyGrant(): void {
    this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied Grant', detail: ''});
  }

  showEditGrantDialog(toEdit: Grant | undefined): void {
    const ref = this.dialogService.open(EditGrantModalWrapperComponent, {
      data: {
        grant: toEdit
      },
      showHeader: true,
      header: toEdit === undefined ? 'Create new Grant' : 'Edit Grant',
      width: '70%',
      styleClass: 'overflowable-dialog'
    });
    ref.onClose.subscribe((grant: Grant) => {
      if (grant) {
        this.messageService.add({key: 'toast', severity: 'info', summary: (toEdit === undefined ? 'Added' : 'Edited') + ' Grant'});
        if (toEdit === undefined) {
          const newList = new Array<Grant>();
          this.programService.currentProgram.grants.forEach(g => newList.push(g));
          newList.push(grant);
          this.programService.currentProgram.grants = newList;
        }
      }
    });
    this.programService.getAvailableConditions(this.programId).pipe(catchError(err => {
      if (err) {
        ref.close();
        this.messageService
          .add({
            key: 'toast',
            severity: 'error',
            summary: 'Could not load available conditions, cannot edit Grant',
            detail: ''
          });
      }
      return err;
    }));
  }
}
