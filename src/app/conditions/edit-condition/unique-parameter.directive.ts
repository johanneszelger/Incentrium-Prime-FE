import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {map} from 'rxjs/operators';
import {Program} from '../../models/program.model';
import {Grant} from '../../models/grant.model';
import {MarketAbsConditionParameter, MarketRelConditionParameter} from '../../models/condition.model';

@Directive({
  selector: '[incUniqueParameter]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: UniqueParameterDirective,
    multi: true
  }]
})
export class UniqueParameterDirective implements Validator {
  @Input() parameterList: Array<MarketRelConditionParameter | MarketAbsConditionParameter>;

  validate(control: AbstractControl): {[key: string]: any} | null {
    const uniqe = this.parameterList.filter(g => {
      // @ts-ignore
      return (g.absValue || g.relValue) === control.value;
    }).length === 0;
    if (!uniqe) {
      return { parameterNotUnique: true };
    }
    return null;
  }
}
