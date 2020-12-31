import {AfterViewChecked, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {GrantService} from '../../../services/grant.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

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
  saving = false;

  constructor(private grantService: GrantService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit(): void {
    if (this.grant === undefined) {
      this.editMode = false;
    }
  }

  ngAfterViewInit(): void {
    this.loading = true;
  }

  updateOrSaveGrant(grant: Grant): void {
    this.saving = true;
    this.grantService.save(grant, this.editMode).subscribe(
      res => {
        this.saving = false;
        this.router.navigate(['/grants']);
        this.messageService.add({key: 'toast', severity: 'success', summary: (this.editMode ? 'Saved' : 'Created') + ' Grant', detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not save grant', detail: ''});
        }
        this.saving = false;
      }
    );
  }
}
