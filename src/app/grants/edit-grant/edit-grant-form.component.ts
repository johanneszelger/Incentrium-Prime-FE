import {AfterViewInit, Component, Directive, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {Condition} from '../../models/condition.model';
import {AbstractControl, NG_VALIDATORS, NgModel, Validator, ValidatorFn} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {YearService} from '../../services/year.service';
import {ConditionService} from '../../services/condition.service';
import {conditionallyCreateMapObjectLiteral} from '@angular/compiler/src/render3/view/util';
import {MessageService, TreeNode} from 'primeng/api';
import {Program} from '../../models/program.model';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {catchError, finalize, first, map} from 'rxjs/operators';

@Component({
  selector: 'inc-edit-grant-form',
  templateUrl: './edit-grant-form.component.html',
  styleUrls: ['./edit-grant-form.component.scss']
})
export class EditGrantFormComponent implements OnInit, AfterViewInit {
  @Input() program: Program = null;
  @Input() grantObservable: Observable<Grant>;
  @Input() showDropdown = true;
  @Input() saving = false;

  @Output() grantChange: EventEmitter<Grant> = new EventEmitter();
  @Output() loadingComplete: EventEmitter<void> = new EventEmitter();

  grant: Grant;
  groupedPrograms: Array<any>;
  editMode = true;
  availableConditions: Array<Condition>;
  grouped = true;
  // tslint:disable-next-line:variable-name
  selectedProgram = new Program();
  plChecked = false;
  loading = false;

  constructor(private programService: ProgramService,
              private conditionService: ConditionService,
              private messageService: MessageService,
              public yearService: YearService) {
  }

  ngOnInit(): void {
    this.grant = new Grant();
    this.loadingComplete.subscribe(() => this.loading = false);
  }

  ngAfterViewInit(): void {
    this.loading = true;
    if (this.grantObservable === undefined) {
      this.editMode = false;
      this.loadProgramsAndConditions();
    } else {
      this.grantObservable.subscribe(g => {
        this.grant = g;
        this.plChecked = this.grant.plDate !== undefined;
        this.loadProgramsAndConditions();
      });
    }
  }

  loadProgramsAndConditions(): void {
    const dataSubscriptions = new Array<Observable<any>>();
    dataSubscriptions.push(this.programService.listGroupedByProgramType().pipe(map(res => res, catchError(err => {
      if (err) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Programs', detail: ''});
      }
      return of('');
    }))));
    dataSubscriptions.push(this.conditionService.getAvailableConditions(this.grant.programId));

    forkJoin(dataSubscriptions).subscribe((res) => {
        this.groupedPrograms = res[0].groupedPrograms;
        this.grouped = res[0].grouped;

        if (this.grant !== undefined) {
          this.selectedProgram = this.groupedPrograms.filter(p => p.id === this.grant.programId)[0];
        }

        this.availableConditions = res[1];
        this.loadingComplete.emit();
      }
    );
  }

  createOrUpdateGrant(): void {
    this.grantChange.emit(this.grant);
  }

  selectedProgramChanged(grantIdControl: NgModel): void {
    this.grant.programId = this.selectedProgram.id;
  }
}
