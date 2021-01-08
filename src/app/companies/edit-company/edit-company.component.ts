import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {Company} from '../../models/company.model';
import {AccountService} from '../../services/account.service';
import {YearService} from '../../services/year.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {CompanyService} from '../../services/company.service';
import {Role} from '../../models/role.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'inc-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = false;
  editMode = false;
  companyId: number;
  company = new Company();
  saving = false;
  private paramSubscription;

  constructor(public accountService: AccountService,
              public yearService: YearService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private companyService: CompanyService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.paramSubscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.companyId = params.companyId;
        if (this.companyId === undefined) {
          this.loading = false;
          return;
        }
        this.companyService.loadCompany(this.companyId).pipe(finalize(() => this.loading = false)).subscribe(
          company => {
            this.company = company;
            this.editMode = true;
          },
          error => {
            if (error) {
              this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Company', detail: ''});
            }
            this.router.navigate(['companies']);
          });
      });
  }

  submitCompany(): void {
    this.saving = true;
    this.companyService.save(this.company, this.editMode).pipe(finalize(() => this.saving = false)).subscribe(user => {
        this.messageService.add({
          key: 'toast',
          severity: 'success',
          summary: (this.editMode ? 'Saved' : 'Created') + 'Company',
        });
        this.router.navigate(['companies']);
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not ' + (this.editMode ? 'save' : 'create')
              + ' Company', detail: ''});
        }
      });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

}
