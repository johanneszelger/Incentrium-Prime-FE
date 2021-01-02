import {AfterViewChecked, AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {GrantService} from '../../../services/grant.service';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'inc-edit-grant-wrapper',
  templateUrl: './edit-grant-wrapper.component.html',
  styleUrls: ['./edit-grant-wrapper.component.scss']
})
export class EditGrantWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  private paramSubscription;
  grant: Grant;
  editMode = true;
  loading = false;
  saving = false;

  constructor(private grantService: GrantService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        const programId = params.programId || '';
        const grantId = params.grantId || '';
        if ('' === programId || '' === grantId) {
          this.loading = false;
          this.grant = new Grant(null);
          return;
        }
        this.grantService.loadGrant(programId, grantId).pipe(first()).subscribe(
          grant => {
            this.grant = grant;
            this.editMode = true;
          },
          error => {
            if (error) {
              this.messageService.add({severity: 'error', summary: 'Could not load grant', detail: ''});
            }
            this.router.navigate(['grants']);
          });

        if (this.grant === undefined) {
          this.editMode = false;
        }
      });
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

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }
}
