import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgramService} from '../../services/program.service';
import {first} from 'rxjs/operators';
import {Program} from '../../models/program.model';
import {MessageService} from 'primeng/api';
import {Grant} from '../../models/grant.model';
import {NgForm} from '@angular/forms';
import {ProgramType} from '../../models/programType.model';

@Component({
  selector: 'inc-edit-program',
  templateUrl: './edit-program.component.html',
  styleUrls: ['./edit-program.component.scss']
})
export class EditProgramComponent implements OnInit, OnDestroy{
  private paramSubscription;
  private programId: string;
  private program: Program;
  private programTypeEnum = ProgramType;
  //newGrant: Grant;
  //grantToCopy: Grant;
  programEditMode = false;
  //grantEditMode: boolean;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.program = new Program();
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.programId = params.programId || '';
        if ('' === this.programId) {
          this.loading = false;
          return;
        }
        this.programService.loadProgram(this.programId).pipe(first()).subscribe(
          program => {
            this.program = program;
            this.programEditMode = true;
            this.loading = false;
          },
            error => {
              this.messageService.add({severity: 'error', summary: 'Could not load program', detail: ''});
              this.router.navigate(['programs']);
            });
      });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  public submitProgram(form: NgForm): void {
    this.loading = true;
    this.programService.save(this.program, this.programEditMode)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.router.navigate(['/programs']);
        },
        error => {
          this.loading = false;
        });
  }

  /*createOrUpdateGrant(newModal: NgbActiveModal): void {
    const grantsWithId = this.program.grants.filter(g => g.id === this.newGrant.id).length;
    if ((grantsWithId > 1 && this.grantEditMode) || (grantsWithId > 0 && !this.grantEditMode)) {
      this.showGrantExistsWarning();
    }

    console.log(this.newGrant);
    if (!this.grantEditMode) {
      this.program.grants.push(this.newGrant);
    }
    newModal.dismiss('created successfully');
  }

  copyGrant(copyForm: NgForm, copyModal: NgbActiveModal): void {
    const grantsWithId = this.program.grants.filter(g => g.id === copyForm.value.copyId).length;
    if (grantsWithId > 0) {
      this.showGrantExistsWarning();
    }

    this.program.grants.push(this.grantToCopy.clone(copyForm.value.copyId));
    copyModal.dismiss('copied successfully');
  }

  private showGrantExistsWarning(): void {
    this.alertService.warn('Grant with this ID already exists, won\'t be able to save!', 1500);
  }

  removeGrant(grant: Grant): void {
    this.program.removeGrant(grant);
  }

  openModal(newModalContent): void {
    this.modalService.open(newModalContent, {ariaLabelledBy: 'modal-basic-title'});
  }

  openCreateGrantModal(newModalContent, grant): void {
    this.grantEditMode = grant != null;
    if (this.grantEditMode) {
      this.newGrant = grant;
    } else {
      this.newGrant = new Grant(this.program.id);
    }
    console.log(this.newGrant);
    this.modalService.open(newModalContent, {ariaLabelledBy: 'modal-basic-title'});
  }

  openCopyGrantModal(copyModalContent, grant): void {
    this.grantToCopy = grant;
    this.modalService.open(copyModalContent, {ariaLabelledBy: 'modal-basic-title'});
  }*/

  updateGrantProgramIds(): void{
    this.program.grants.forEach((g) => g.programId = this.program.id);
  }
}
