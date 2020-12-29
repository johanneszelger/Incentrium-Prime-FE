import {Component, Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {ProgramService} from '../../services/program.service';

@Component({
  selector: 'inc-edit-grant',
  templateUrl: './edit-grant.component.html',
  styleUrls: ['./edit-grant.component.scss']
})
export class EditGrantComponent implements OnInit {
  @Input() programId: string;
  @Input() grant: Grant;
  @Output() submit: EventEmitter<Grant> = new EventEmitter();
  editMode = true;
  saving = false;

  constructor(private programService: ProgramService) {
  }

  getProgramIdValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = this.programService.currentProgram.grants.filter(g => g.id === control.value).length === 0;
      return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }

  ngOnInit(): void {
    if (this.grant === undefined) {
      this.editMode = false;
      this.grant = new Grant(this.programId);
    }
  }

  createOrUpdateGrant(): void {
    this.submit.emit(this.grant);
  }
}

