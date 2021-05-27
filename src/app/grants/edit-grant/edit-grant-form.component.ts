import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {NgModel} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {YearService} from '../../services/year.service';
import {MessageService} from 'primeng/api';
import {Program} from '../../models/program.model';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Condition} from "../../models/condition.model";

@Component({
  selector: 'inc-edit-grant-form',
  templateUrl: './edit-grant-form.component.html',
  styleUrls: ['./edit-grant-form.component.scss']
})
export class EditGrantFormComponent implements OnInit {
  @Input() program: Program = null;
  @Input() grantObservable: Observable<Grant>;
  @Input() showDropdown = true;
  @Input() saving = false;

  @Output() grantChange: EventEmitter<Grant> = new EventEmitter();
  @Output() loadingComplete: EventEmitter<void> = new EventEmitter();

  grant: Grant;
  groupedPrograms: Array<any>;
  editMode = true;
  grouped = true;
  selectedProgram;
  plChecked = false;
  loading = true;

  constructor(private programService: ProgramService,
              private messageService: MessageService,
              public yearService: YearService) {
  }

  ngOnInit(): void {
    this.grant = new Grant();
    this.loadingComplete.subscribe(() => this.loading = false);
    if (this.grantObservable === undefined) {
      this.editMode = false;
      this.loadPrograms();
    } else {
      this.grantObservable.subscribe(g => {
        this.grant = g;
        this.plChecked = this.grant.plDate !== undefined;
        this.loadPrograms();
      });
    }
  }

  loadPrograms(): void {
    if (!this.showDropdown) {
      setTimeout(() => this.loadingComplete.emit(), 500);
      return;
    }
    this.programService.listGroupedByProgramType().pipe(finalize(() => this.loadingComplete.emit())).subscribe(
      res => {
        this.groupedPrograms = res.groupedPrograms;
        this.grouped = res.grouped;

        if (this.grant !== undefined) {
          this.selectedProgram = this.groupedPrograms.filter(p => p.id === this.grant.programId)[0];
        }

      }, error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Programs', detail: ''});
        }
      });
  }

  createOrUpdateGrant(): void {
    this.grantChange.emit(this.grant);
  }

  selectedProgramChanged(grantIdControl: NgModel): void {
    this.grant.programId = this.selectedProgram.id;
  }
}
