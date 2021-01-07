import {AfterViewChecked, AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Grant} from '../../../models/grant.model';
import {GrantService} from '../../../services/grant.service';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'inc-edit-grant-wrapper',
  templateUrl: './edit-grant-wrapper.component.html',
  styleUrls: ['./edit-grant-wrapper.component.scss']
})
export class EditGrantWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  private paramSubscription;
  grantSubject;
  grantId: number;
  editMode = true;
  loading = false;
  saving = false;

  constructor(private grantService: GrantService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.grantId = params.grantId;
        if (!this.grantId) {
          this.editMode = false;
          return;
        } else {
          this.grantSubject = new Subject<Grant>();
        }
      });
  }

  ngAfterViewInit(): void {
    this.loading = true;
    if (this.grantId) {
          this.editMode = true;
          this.grantService.loadGrant(this.grantId).pipe(first()).subscribe(
            grant => {
              this.grantSubject.next(grant);
            },
            error => {
              if (error) {
                this.messageService.add({severity: 'error', summary: 'Could not load grant', detail: ''});
              }
              this.router.navigate(['grants']);
            });
        }
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
