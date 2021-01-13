import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {ProgramService} from '../../services/program.service';
import {MessageService} from 'primeng/api';
import {Valuation} from '../../models/valuation.model';
import {ExerciseType} from '../../models/exerciseType.model';
import {NgForm} from '@angular/forms';
import {ValuationService} from '../../services/valuation.service';
import {Router} from '@angular/router';
import {YearService} from '../../services/year.service';

@Component({
  selector: 'inc-create-valuation',
  templateUrl: './create-valuation.component.html',
  styleUrls: ['./create-valuation.component.scss']
})
export class CreateValuationComponent implements OnInit, AfterViewInit {
  loading = false;
  groupedPrograms: any;
  grouped: true;
  valuation: Valuation;
  selectedProgram: any;
  exerciseTypeEnum = ExerciseType;
  saving = false;
  showAdditionalFields = true;
  exerciseTypeExpander: ExerciseType;

  constructor(private programService: ProgramService,
              private messageService: MessageService,
              private valuationService: ValuationService,
              private router: Router,
              public yearService: YearService) {
  }

  ngOnInit(): void {
    this.valuation = new Valuation();
    this.exerciseTypeExpander = this.valuation.exerciseType;
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.programService.listGroupedByProgramType().subscribe(data => {
      this.groupedPrograms = data.groupedPrograms;
      this.grouped = data.grouped;
      this.loading = false;
    }, error => {
      if (error) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Programs', detail: ''});
      }
      this.loading = false;
    });
  }

  selectedProgramChanged(): void {
    this.valuation.programId = this.selectedProgram.id;
  }

  submitValuation(valuationForm: NgForm): void {
    this.saving = true;
    this.valuationService.save(this.valuation).subscribe(res => {
      this.saving = false;
      this.router.navigate(['/valuations']);
      this.messageService.add({
        key: 'toast',
        severity: 'success',
        summary: 'Started calculation for a new valuation',
        detail: 'Usually, the calculation is expected to take about one minute, depending on the number of grants, conditions etc.'
      });
    }, error => {
      if (error) {
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not save Valuation', detail: 'Calculation has not been started'});
      }
      this.saving = false;
    });
  }

  selectedExerciseTypeChanged(): void {
    setTimeout(() => {
      this.showAdditionalFields = true;
      this.exerciseTypeExpander = this.valuation.exerciseType;
    }, this.showAdditionalFields ? 200 : 0);
    this.showAdditionalFields = false;
  }
}
