import {Component, Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {Condition} from '../../models/condition.model';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {ConditionService} from '../../services/condition.service';
import {conditionallyCreateMapObjectLiteral} from '@angular/compiler/src/render3/view/util';
import {MessageService} from 'primeng/api';

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
  availableConditions: Array<Condition>;

  constructor(private programService: ProgramService,
              private conditionService: ConditionService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    if (this.grant === undefined) {
      this.editMode = false;
      this.grant = new Grant(this.programId);
    }

    this.programService.getAvailableConditions(this.programId).subscribe(
      conditions => {
          const grantConditionIds = this.grant.conditions.map(c => c.id);
          this.availableConditions = conditions.filter(c => grantConditionIds.indexOf(c.id) === -1);
        },
      error =>
        this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load conditions for this program', detail: ''})
    );
  }

  createOrUpdateGrant(): void {
    this.submit.emit(this.grant);
  }
}

