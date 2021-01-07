/*import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {map} from 'rxjs/operators';
import {Program} from '../../models/program.model';
import {Grant} from '../../models/grant.model';

@Directive({
  selector: '[incUniqueGrantId]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: UniqueGrantIdDirective,
    multi: true
  }]
})
export class UniqueGrantIdDirective implements Validator {
  @Input() existingGrants: Array<Grant> = this.programService.currentProgram.grants;
  constructor(private programService: ProgramService) {
  }
  validate(control: AbstractControl): {[key: string]: any} | null {
    console.log('validating grant id');
    const uniqe = this.existingGrants.filter(g => g.id === control.value).length === 0;
    if (!uniqe) {
      return { grantIdNotUnique: true };
    }
    return null;
  }
}*/
