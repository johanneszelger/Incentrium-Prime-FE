import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Program} from '../../models/program.model';
import {ProgramService} from '../../services/program.service';
import {ConfirmationService, MessageService, TreeNode} from 'primeng/api';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {Router} from '@angular/router';

@Component({
  selector: 'inc-list-programs',
  templateUrl: './list-programs.component.html',
  styleUrls: ['./list-programs.component.scss']
})
export class ListProgramsComponent implements OnInit {
  programs: Array<Program>;
  loading = true;
  copying = false;

  constructor(private programService: ProgramService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.programService.list().subscribe(
      data => {
        this.programs = data;
        this.loading = false;
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load programs', detail: ''});
        }
        this.loading = false;
      }
    );
  }


  deletePrograms(programs: Array<Program>): void {
    this.programService.delete(programs.map(p => p.id)).subscribe(
      success => {
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted selected Program(s)', detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete selected Program(s)', detail: ''});
        }
        const newArray = new Array<Program>();
        this.programs.forEach(p => newArray.push(p));
        programs.forEach(p => newArray.push(p));
        this.programs = newArray;
      }
    );
  }

  moveToEditProgram(program: Program = new Program()): void {
    this.router.navigate(['/editprogram/'],  { queryParams: { programId: program.id } });
  }

  copyProgram(params): void {
    this.programService.copy(params.oldId, params.copyName).subscribe(
      succ => {
        this.addProgramToTable(succ);
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied Program', detail: ''});
        this.copying = false;
        params.toHide.hide();
      },
      error =>  {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not copy Program', detail: ''});
        }
        this.copying = false;
        params.toHide.hide();
      },
    );
  }

  addProgramToTable(program: Program): void{
    const newArray = new Array<Program>();
    this.programs.forEach(p => newArray.push(p));
    newArray.push(program);
    this.programs = newArray;
  }
}
