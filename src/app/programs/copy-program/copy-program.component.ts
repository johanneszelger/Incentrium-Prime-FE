import {Component, OnInit} from '@angular/core';
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
  loading: boolean;

  constructor(public dialogRef: DynamicDialogRef, private programService: ProgramService) {
  }

  ngOnInit(): void {
  }

  copyProgram(copyForm: NgForm): void {
    this.loading = true;
    const copy = this.programService.currentProgram.clone(copyForm.value.copyId);
    this.programService.save(copy)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error => {
          this.loading = false;
          this.dialogRef.close(false);
        });
  }
}
