import {Component, OnInit} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {ProgramService} from '../../services/program.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'inc-list-programs',
  templateUrl: './list-programs.component.html',
  styleUrls: ['./list-programs.component.scss']
})
export class ListProgramsComponent implements OnInit {
  programTreeNodes: TreeNode[];
  cols: any[];
  loading: boolean;

  constructor(private programService: ProgramService, private router: Router) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.programService.listAsTreeNode()
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.programTreeNodes = data;
        },
        error => {
          this.loading = false;
        });
  }

  editEntity(rowData: any): void {
    this.loading = true;
    switch (rowData.type) {
      case 'program':
        console.log('starting service');
        this.programService.loadAndSetProgram(rowData.col1).subscribe(() => this.router.navigate(['/editprogram']));
    }
  }

  copyEntity(rowData: any) {

  }

  deleteEntity(rowData: any) {

  }
}
