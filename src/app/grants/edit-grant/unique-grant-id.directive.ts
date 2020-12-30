import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {map} from 'rxjs/operators';

@Directive({
  selector: '[incUniqueGrantId]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: UniqueGrantIdDirective,
    multi: true
  }]
})
export class UniqueGrantIdDirective implements Validator {
  constructor(private programService: ProgramService) {
  }
  validate(control: AbstractControl): {[key: string]: any} | null {
    const uniqe = this.programService.currentProgram.grants.filter(g => g.id === control.value).length === 0;
    if (!uniqe) {
      return { grantIdNotUnique: true };
    }
    return null;
  }
}
