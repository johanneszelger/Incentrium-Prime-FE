import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Program} from '../../models/program.model';
import {ProgramService} from '../../services/program.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {NgForm} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {Router} from '@angular/router';

@Component({
  selector: 'inc-list-programs',
  templateUrl: './list-programs.component.html',
  styleUrls: ['./list-programs.component.scss']
})
export class ListProgramsComponent implements OnInit, AfterViewInit {
  programs: Array<Program>;
  selectedPrograms = new Array<Program>();
  loading = false;
  private deleting = false;
  private copying = false;
  programToCopy: Program;

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
  ngAfterViewInit(): void {
    this.loading = true;
  }


  confirmDeleteSingle($event: MouseEvent, program: Program): void {
    this.confirmationService.confirm({
      key: program.id,
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
         this.programService.delete([program.id]).subscribe(
           success => {
             this.programs = this.programs.filter(p => p !== program);
             this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted selected Program', detail: ''});
           },
            error => {
             if (error) {
               this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete selected Program', detail: ''});
             }
            }
         );
      }
    });
  }

  confirmDeleteSelection(): void {
    console.log(this.selectedPrograms);
    if (this.selectedPrograms === undefined || !this.selectedPrograms.length) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Grants selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleting = true;
          this.programService.delete(this.selectedPrograms.map(p => p.id)).subscribe(
            success => {
              this.programs = this.programs.filter(p => !this.selectedPrograms.includes(p));
              this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted selected Programs', detail: ''});
              this.deleting = false;
            },
            error => {
              if (error) {
                this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete selected Programs', detail: ''});
              }
              this.deleting = false;
            },
          );
        }
      });
    }
  }

  showAddProgramDialog(): void {
    this.router.navigate(['/createprogram']);
  }

  moveToEditProgram(program: Program = new Program()): void {
    this.router.navigate(['/editprogram/'],  { queryParams: { programId: program.id } });
  }

  copyProgram(copyForm: NgForm, toHide: OverlayPanel): void {
    if (this.copying) { return; }
    this.copying = true;
    this.programService.copy(this.programToCopy.id, copyForm.value.copyId).subscribe(
      succ => {
        this.addProgramToTable(succ);
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied Program', detail: ''});
        this.copying = false;
        toHide.hide();
      },
      error =>  {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not copy Program', detail: ''});
        }
        this.copying = false;
        toHide.hide();
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
