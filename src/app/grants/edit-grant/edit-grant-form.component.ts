import {Component, Directive, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {log} from 'util';
import {ProgramType} from '../../models/programType.model';

@Component({
  selector: 'inc-edit-grant-form',
  templateUrl: './edit-grant-form.component.html',
  styleUrls: ['./edit-grant-form.component.scss']
})
export class EditGrantFormComponent implements OnInit {
  @Input() program: Program = null;
  @Input() grant: Grant;
  @Input() showDropdown = true;
  @Input() saving = false;

  @Output() grantChange: EventEmitter<Grant> = new EventEmitter();
  @Output() loadingComplete: EventEmitter<void> = new EventEmitter();
  @Output() conditionLoadingComplete: EventEmitter<void> = new EventEmitter();

  groupedProgramIds: Array<any>;
  editMode = true;
  loading = true;
  availableConditions: Array<Condition>;
  grouped = true;
  // tslint:disable-next-line:variable-name
  selectedProgram = new Program();

  constructor(private programService: ProgramService,
              private conditionService: ConditionService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    if (this.grant === undefined) {
      this.editMode = false;
      this.grant = new Grant(this.program ? this.program.id : null);
    }

    const dataSubscriptions = new Array<Observable<any>>();
    dataSubscriptions.push(this.programService.list().pipe(map(res => res, catchError(err => {
      if (err) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load programs', detail: ''});
      }
      return of('');
    }))));
    dataSubscriptions.push(this.programService.getAvailableConditions(this.program ? this.program.id : null)
      .pipe(map(res => res, catchError(err => {
        if (err) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load conditions', detail: ''});
        }
        return of('');
      }))));

    forkJoin(dataSubscriptions).subscribe((res) => {
        const groupedPrograms = new Array();
        // tslint:disable-next-line:forin
        for (const item in ProgramType) {
          groupedPrograms.push({
            label: ProgramType[item], value: item, icon: this.getIconForProgramType(item), items: new Array<string>()
          });
        }
        res[0].forEach(p => {
          if (p.programType === ProgramType.EQUITY_SETTLED) {
            groupedPrograms[0].items.push(p);
          }
          if (p.programType === ProgramType.CASH_SETTLED) {
            groupedPrograms[1].items.push(p);
          } else {
            throwError('unknown program type: ', p.programType);
          }
        });
        this.groupedProgramIds = new Array<any>();
        groupedPrograms.forEach(group => {
          if (group.items.length > 0) {
            this.groupedProgramIds.push(group);
          }
        });
        if (this.groupedProgramIds.length === 1) {
          this.groupedProgramIds = this.groupedProgramIds[0].items;
          this.grouped = false;
        }
        if (this.grant !== undefined) {
          this.selectedProgram = res[0].filter(p => p.id === this.grant.programId)[0];
        }
        this.availableConditions = res[1];
        this.loading = false;
        this.loadingComplete.emit();
      }
    );
  }

  private getIconForProgramType(item: string): string {
    if (ProgramType[item] === ProgramType.EQUITY_SETTLED) {
      return 'pi pi-ticket';
    }
    if (ProgramType[item] === ProgramType.CASH_SETTLED) {
      return 'pi pi-money-bill';
    } else {
      throwError('unknown program type: ' + item);
    }
  }

  createOrUpdateGrant(): void {
    this.grantChange.emit(this.grant);
  }

  selectedProgramChanged(grantIdControl: NgModel): void {
    this.grant.programId = this.selectedProgram.id;
    setTimeout(() => grantIdControl.control.updateValueAndValidity(), 30);
  }

  getExistingGrants(): Array<Grant> {
    if (this.showDropdown) {
      return this.selectedProgram.grants;
    } else {
      return this.program.grants;
    }
  }
}

