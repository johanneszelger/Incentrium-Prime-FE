import {AfterViewInit, Component, Directive, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {Condition} from '../../models/condition.model';
import {AbstractControl, NG_VALIDATORS, NgModel, Validator, ValidatorFn} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {ConditionService} from '../../services/condition.service';
import {conditionallyCreateMapObjectLiteral} from '@angular/compiler/src/render3/view/util';
import {MessageService, TreeNode} from 'primeng/api';
import {Program} from '../../models/program.model';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {catchError, first, map} from 'rxjs/operators';

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
  @Output() conditionLoadingComplete: EventEmitter<void> = new EventEmitter();

  grant: Grant;
  groupedPrograms: Array<any>;
  editMode = true;
  loadingConditions = false;
  availableConditions: Array<Condition>;
  grouped = true;
  // tslint:disable-next-line:variable-name
  selectedProgram = new Program();

  constructor(private programService: ProgramService,
              private conditionService: ConditionService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.grant = new Grant(null);
  }

  ngAfterViewInit(): void {
    if (this.grantObservable === undefined) {
      this.editMode = false;
      this.loadProgramsAndConditions();
    } else {
      this.grantObservable.subscribe(g => {
        this.grant = g;
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
    dataSubscriptions.push(this.loadConditions());

    forkJoin(dataSubscriptions).subscribe((res) => {
        this.groupedPrograms = res[0].groupedPrograms;
        this.grouped = res[0].grouped;

        if (this.grant !== undefined) {
          this.selectedProgram = res[0].filter(p => p.id === this.grant.programId)[0];
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
    this.loadingConditions = true;
    this.grant.programId = this.selectedProgram.id;
    setTimeout(() => grantIdControl.control.updateValueAndValidity(), 30);
    this.loadConditions().subscribe(c => {
      this.availableConditions = c;
      this.loadingConditions = false;
    });
  }

  getExistingGrants(): Array<Grant> {
    if (this.editMode) {
      return new Array<Grant>();
    }
    if (this.showDropdown) {
      return this.selectedProgram.grants;
    } else {
      return this.program.grants;
    }
  }

  private loadConditions(): Observable<any> {
    return this.programService.getAvailableConditions(this.grant.programId)
      .pipe(map(res => res, catchError(err => {
        if (err) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load conditions', detail: ''});
          this.loadingConditions = false;
        }
        return of('');
      })));
  }
}

