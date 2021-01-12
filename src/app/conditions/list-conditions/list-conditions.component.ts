import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Condition} from '../../models/condition.model';
import {ConditionService} from '../../services/condition.service';
import {MessageService, TreeNode} from 'primeng/api';
import {Router} from '@angular/router';
import {Grant} from '../../models/grant.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'inc-list-conditions',
  templateUrl: './list-conditions.component.html',
  styleUrls: ['./list-conditions.component.scss']
})
export class ListConditionsComponent implements OnInit, AfterViewInit {
  conditions: Array<TreeNode>;
  loading = false;

  constructor(private conditionService: ConditionService,
              private messageService: MessageService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.conditionService.listAsTreeNode().pipe(finalize(() => this.loading = false)).subscribe(succ => {
        this.conditions = succ;
      }, error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load conditions', detail: ''});
        }
      }
    );
  }

  addCondition(): void {
    this.router.navigate(['/createcondition/']);
  }

  editCondition(conditionId: string): void {
    this.router.navigate(['/editcondition/'],  { queryParams: { conditionId } });
  }

  deleteConditions(conditions: Array<any>): void {
    this.conditionService.delete(conditions.filter(c => c.node.data.type === 'condition').map(c => c.node.data.col1)).subscribe(
      data => {
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted condition(s)', detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete condition(s)', detail: ''});
        }
        const newArray = new Array<TreeNode>();
        this.conditions.forEach(c => newArray.push(c));
        conditions.forEach(c => newArray.push(c.node));
        this.conditions = newArray;
      }
    );
  }
}
