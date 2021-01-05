import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ProgramService} from '../../services/program.service';
import {MessageService, TreeNode} from 'primeng/api';

@Component({
  selector: 'inc-list-valuations',
  templateUrl: './list-valuations.component.html',
  styleUrls: ['./list-valuations.component.scss']
})
export class ListValuationsComponent implements OnInit, AfterViewInit {
  programsWithValuations: Array<TreeNode>;
  loading = false;

  constructor(private programService: ProgramService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.programService.listAsTreeNodesWithValuations().subscribe(data => {
        this.programsWithValuations = data;
        this.loading = false;
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load valuation data', detail: ''});
        }
        this.loading = false;
      }
    );
  }

}
