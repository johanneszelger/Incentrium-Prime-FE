import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ProgramService} from '../../services/program.service';
import {first, timeout} from 'rxjs/operators';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'inc-copy-program',
  templateUrl: './copy-program.component.html',
  styleUrls: ['./copy-program.component.scss']
})
export class CopyProgramComponent implements OnInit {
  @Input() toHide;
  @Output() copied: EventEmitter<void> = new EventEmitter();
  loading: boolean;

  constructor(private programService: ProgramService) {
    //public dialogRef: DynamicDialogRef,
  }

  ngOnInit(): void {
  }

  copyProgram(copyForm: NgForm): void {
    this.loading = true;
    this.programService.copy(this.programService.currentProgram.id, copyForm.value.copyId)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.copied.emit();
          this.toHide.hide();
          //this.dialogRef.close(true);
        },
        error => {
          this.loading = false;
          // TODO: show error msg
          this.toHide.hide();
          //this.dialogRef.close(false);
        });
  }
}
