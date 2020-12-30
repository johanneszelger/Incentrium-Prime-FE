import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Grant} from '../../../models/grant.model';

@Component({
  selector: 'inc-edit-grant-wrapper',
  templateUrl: './edit-grant-wrapper.component.html',
  styleUrls: ['./edit-grant-wrapper.component.scss']
})
export class EditGrantWrapperComponent implements OnInit, AfterViewInit {
  @Input() programId: string = null;
  @Input() grant: Grant;
  editMode = true;
  loading = false;

  constructor() { }

  ngOnInit(): void {
    if (this.grant === undefined) {
      this.editMode = false;
    }
  }

  ngAfterViewInit(): void {
    this.loading = true;
  }

}
