import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Program} from '../../../models/program.model';
import {ConfirmationService, MessageService} from 'primeng/api';
import {OverlayPanel} from 'primeng/overlaypanel';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'inc-program-table',
  templateUrl: './program-table.component.html',
  styleUrls: ['./program-table.component.scss']
})
export class ProgramTableComponent implements OnInit {
  @Input() programs: Array<Program>;
  @Input() copying = false;

  @Output() programsChange: EventEmitter<Array<Program>> = new EventEmitter();
  @Output() copyingChange: EventEmitter<boolean> = new EventEmitter();
  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Program>();
  @Output() copy = new EventEmitter<{ oldId: number, copyName: string, toHide: OverlayPanel }>();
  @Output() delete = new EventEmitter<Array<Program>>();

  selectedPrograms: Array<Program>;
  programToCopy: Program;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
  }

  confirmDelete(event: MouseEvent, program: Program | undefined): void {
    if (program === undefined && (this.selectedPrograms === undefined || !this.selectedPrograms.length)) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Grants selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        key: program === undefined ? 'deleteSelected' : program.id.toString(),
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          setTimeout(() => {
            if (program !== undefined) {
              this.programs =
                this.programs.filter(c => c !== program);
            } else {
              this.programs =
                this.programs.filter(c => !this.selectedPrograms.includes(c));
            }
            this.programsChange.emit(this.programs);
            this.delete.emit(program !== undefined ? [program] : this.selectedPrograms);
            this.selectedPrograms = new Array<Program>();
          });
        },
      });
    }
  }

  copyProgram(copyForm: NgForm, op: OverlayPanel): void {
    if (this.copying) {
      return;
    }
    this.copyingChange.emit(true);
    this.copy.emit({oldId: this.programToCopy.id, copyName: copyForm.value.copyName, toHide: op});
  }
}
