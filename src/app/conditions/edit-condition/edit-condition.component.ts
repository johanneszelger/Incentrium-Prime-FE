import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {catchError, first, map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ProgramService} from '../../services/program.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {ConditionService} from '../../services/condition.service';
import {
  Condition,
  MarketAbsConditionParameter,
  MarketRelConditionParameter,
  ServiceConditionParameter
} from '../../models/condition.model';
import {NgForm} from '@angular/forms';
import {forkJoin, Observable, of} from 'rxjs';
import {Program} from '../../models/program.model';
import {ConditionType} from '../../models/conditionType.model';
import {newArray} from '@angular/compiler/src/util';

@Component({
  selector: 'inc-edit-condition',
  templateUrl: './edit-condition.component.html',
  styleUrls: ['./edit-condition.component.scss']
})
export class EditConditionComponent implements OnInit, AfterViewInit {
  @ViewChild('conditionForm') form: NgForm;

  private paramSubscription;
  private conditionId: string;
  conditionTypeEnum = ConditionType;
  condition = new Condition();
  loading = false;
  saving = false;
  editMode = false;
  selectedProgram: any;
  groupedPrograms: any;
  grouped: boolean;
  selectedConditionType: ConditionType;
  showAdditionalFields = false;
  private nameIndex: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public conditionService: ConditionService,
    private messageService: MessageService,
    private programService: ProgramService) {
    this.nameIndex = 0;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.conditionId = params.conditionId || '';
        this.loadProgramsAndCondition();
      });
  }

  loadProgramsAndCondition(): void {
    const dataSubscriptions = new Array<Observable<any>>();
    dataSubscriptions.push(this.programService.listGroupedByProgramType().pipe(map(res => res, catchError(err => {
      if (err) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Programs', detail: ''});
      }
      return of('');
    }))));
    if (this.conditionId !== '') {
      dataSubscriptions.push(this.conditionService.loadCondition(this.conditionId).pipe(map(res => res, catchError(err => {
        if (err) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Condition', detail: ''});
        }
        return of('');
      }))));
    }

    forkJoin(dataSubscriptions).subscribe((res) => {
        this.groupedPrograms = res[0].groupedPrograms;
        this.grouped = res[0].grouped;

        const globalProgram = new Program();
        globalProgram.name = 'Global';
        if (this.grouped) {
          this.groupedPrograms.splice(0, 0, {
            label: 'Global',
            value: globalProgram,
            icon: 'pi pi-globe',
            items: [globalProgram]
          });
        } else {
          this.groupedPrograms.splice(0, 0, globalProgram);
        }

        this.condition = res[1];

        if (this.condition !== undefined) {
          this.selectedProgram = this.groupedPrograms.filter(p => p.id === this.condition.programVisibilityId)[0];
          this.showAdditionalFields = true;
          this.editMode = true;
        } else {
          this.condition = new Condition();
          this.selectedProgram = globalProgram;
        }

        if (this.condition.programVisibilityId === null) {
          this.selectedProgram = globalProgram;
        }
        if (this.condition.conditionType !== null) {
          this.selectedConditionType = this.condition.conditionType;
        }

        this.loading = false;
      }
    );
  }

  submitCondition(conditionForm: NgForm): void {
    this.saving = true;
    this.conditionService.save(this.condition, this.editMode)
      .pipe(first())
      .subscribe(
        data => {
          this.saving = false;
          this.router.navigate(['/conditions']);
          this.messageService.add({
            key: 'toast',
            severity: 'success',
            summary: (this.editMode ? 'Saved' : 'Created') + ' Condition',
            detail: ''
          });
        },
        error => {
          if (error) {
            this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not save Condition', detail: ''});
          }
          this.saving = false;
        });
  }

  selectedProgramChanged(): void {
    if (this.selectedProgram.id === 'Global') {
      this.condition.programVisibilityId = null;
    } else {
      this.condition.programVisibilityId = this.selectedProgram.id;
    }
  }

  selectedConditionTypeChanged(): void {
    setTimeout(() => {
      this.condition.conditionType = this.selectedConditionType;
      this.showAdditionalFields = true;
    }, this.showAdditionalFields ? 200 : 0);
    this.showAdditionalFields = false;
  }

  addParameter(): void {
    if (this.condition.conditionType === 'Market absolute') {
      const newPrarams = new Array<MarketAbsConditionParameter>();
      newPrarams.push(new MarketAbsConditionParameter());
      this.condition.marketAbsConditionParameters.forEach(p => newPrarams.push(p));
      this.condition.marketAbsConditionParameters = newPrarams;
    } else if (this.condition.conditionType === 'Market relative') {
      const newPrarams = new Array<MarketRelConditionParameter>();
      newPrarams.push(new MarketRelConditionParameter());
      this.condition.marketRelConditionParameters.forEach(p => newPrarams.push(p));
      this.condition.marketRelConditionParameters = newPrarams;
    } else if (this.condition.conditionType === 'Service') {
      const newPrarams = new Array<ServiceConditionParameter>();
      newPrarams.push(new ServiceConditionParameter());
      this.condition.serviceConditionParameters.forEach(p => newPrarams.push(p));
      this.condition.serviceConditionParameters = newPrarams;
    }
  }

  removeParameter(parameter: any): void {
    if (this.condition.conditionType === 'Market absolute') {
      this.condition.marketAbsConditionParameters = this.condition.marketAbsConditionParameters.filter(p => p !== parameter);
    } else if (this.condition.conditionType === 'Market relative') {
      this.condition.marketRelConditionParameters = this.condition.marketRelConditionParameters.filter(p => p !== parameter);
    } else if (this.condition.conditionType === 'Service') {
      this.condition.serviceConditionParameters = this.condition.serviceConditionParameters.filter(p => p !== parameter);
    }
  }
}
