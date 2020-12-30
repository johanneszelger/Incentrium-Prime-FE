import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {map} from 'rxjs/operators';
import {Program} from '../../models/program.model';

@Directive({
  selector: '[incUniqueProgramId]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: UniqueProgramIdDirective,
    multi: true
  }]
})
export class UniqueProgramIdDirective implements Validator {
  @Input() existingPrograms: Array<Program>;

  constructor(private programService: ProgramService) {
  }

  validate(control: AbstractControl): { [key: string]: any } | null {
    const uniqe = this.existingPrograms.filter(p => p.id === control.value).length === 0;
    if (!uniqe) {
      return {programIdNotUnique: true};
    }
    return null;
  }
}
