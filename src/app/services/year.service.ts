import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {forkJoin, Observable, Subject} from 'rxjs';
import {TreeNode} from 'primeng/api';
import {Condition} from '../models/condition.model';
import {ConditionType} from '../models/conditionType.model';
import {Program} from '../models/program.model';

@Injectable({providedIn: 'root'})
export class YearService {
  getYearString(): string {
    const current = new Date();
    return (current.getFullYear() - 2) + ':' + (current.getFullYear() + 10);
  }
}
