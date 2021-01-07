import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ProgramService} from '../../services/program.service';
import {MessageService, TreeNode} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'inc-list-valuations',
  templateUrl: './list-valuations.component.html',
  styleUrls: ['./list-valuations.component.scss']
})
export class ListValuationsComponent implements OnInit, AfterViewInit {
  programsWithValuations: Array<TreeNode>;
  loading = false;

  constructor(private programService: ProgramService,
              private messageService: MessageService,
              private router: Router) {
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
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Valuation data', detail: ''});
        }
        this.loading = false;
      }
    );
  }

  moveToView(id: string): void {
    this.router.navigate(['/viewvaluation/'],  { queryParams: { valuationId: id } });
  }

  moveToNew(): void {
    this.router.navigate(['/createvaluation/']);
  }
}
