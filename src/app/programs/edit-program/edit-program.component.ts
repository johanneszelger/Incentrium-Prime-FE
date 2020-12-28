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
  selectedGrants: Grant[];
  programEditMode = false;
  loading = true;
  saving: any;

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
    this.saving = true;
    this.programService.save(this.program, this.programEditMode)
      .pipe(first())
      .subscribe(
        data => {
          this.saving = false;
          this.router.navigate(['/programs']);
        },
        error => {
          this.saving = false;
        });
  }

  updateGrantProgramIds(): void{
    this.program.grants.forEach((g) => g.programId = this.program.id);
  }

  deleteSelection(): void {
    this.program.grants = this.program.grants.filter(g => !this.selectedGrants.includes(g));
  }
}
