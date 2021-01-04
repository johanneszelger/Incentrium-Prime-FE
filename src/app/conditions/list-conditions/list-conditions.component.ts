import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Condition} from '../../models/condition.model';
import {ConditionService} from '../../services/condition.service';
import {MessageService, TreeNode} from 'primeng/api';

@Component({
  selector: 'inc-list-conditions',
  templateUrl: './list-conditions.component.html',
  styleUrls: ['./list-conditions.component.scss']
})
export class ListConditionsComponent implements OnInit, AfterViewInit {
  conditions: Array<TreeNode>;
  loading = false;

  constructor(private conditionService: ConditionService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.conditionService.listAsTreeNode().subscribe(succ => {
        this.conditions = succ;
        this.loading = false;
      }, error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load conditions', detail: ''});
        }
        this.loading = false;
      }
    );
  }

}
