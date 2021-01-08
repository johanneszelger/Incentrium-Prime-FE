import {AfterViewInit, Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {CompanyService} from '../../services/company.service';
import {Company} from '../../models/company.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'inc-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.scss']
})
export class ListCompaniesComponent implements OnInit, AfterViewInit {
  companies: Array<Company>;
  loading = false;

  constructor(private companyService: CompanyService,
              private messageService: MessageService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.companyService.list().pipe(finalize(() => this.loading = false)).subscribe(
      data => {
        this.companies = data;
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load Companies', detail: ''});
        }
        this.loading = false;
      }
    );
  }

  deleteCompanies(companies: Array<Company>): void {
    this.companyService.delete(companies.map(c => c.id)).subscribe(
      data => {
        this.messageService.add({
          key: 'toast', severity: 'success',
          summary: 'Deleted Compan' + (companies.length === 1 ? 'y' : 'ies'), detail: ''
        });
      },
      error => {
        if (error) {
          this.messageService.add({
            key: 'toast', severity: 'error',
            summary: 'Could not delete Compan' + (companies.length === 1 ? 'y' : 'ies'), detail: ''
          });
        }
        const newArray = new Array<Company>();
        this.companies.forEach(u => newArray.push(u));
        companies.forEach(u => newArray.push(u));
        this.companies = newArray;
      }
    );
  }

  editCompany(company: Company = new Company()): void {
    this.router.navigate(['/editcompany/'], {queryParams: {companyId: company.id}});
  }

}
