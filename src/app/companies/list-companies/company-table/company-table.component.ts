import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../models/user.model';
import {Company} from '../../../models/company.model';
import {Grant} from '../../../models/grant.model';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'inc-company-table',
  templateUrl: './company-table.component.html',
  styleUrls: ['./company-table.component.scss']
})
export class CompanyTableComponent implements OnInit {
  @Input() companies: Array<Company>;

  @Output() companiesChange: EventEmitter<Array<Company>> = new EventEmitter();

  @Output() delete: EventEmitter<Array<Company>> = new EventEmitter();
  @Output() edit: EventEmitter<Company> = new EventEmitter();
  @Output() add: EventEmitter<void> = new EventEmitter();

  selectedCompanies: any;

  constructor(private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  confirmDelete($event: MouseEvent, company: Company): void {
    if (company === undefined && (this.selectedCompanies === undefined || !this.selectedCompanies.length)) {
      this.messageService.add({key: 'toast', severity: 'error', summary: 'No Companies selected', detail: ''});
    } else {
      this.confirmationService.confirm({
        key: company === undefined ? 'deleteSelected' : company.id.toString(),
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          setTimeout(() => {
            if (company !== undefined) {
              this.companies =
                this.companies.filter(g => g !== company);
            } else {
              this.companies =
                this.companies.filter(g => !this.selectedCompanies.includes(g));
            }
            this.companiesChange.emit(this.companies);
            this.delete.emit(company !== undefined ? [company] : this.selectedCompanies);
            this.selectedCompanies = new Array<Grant>();
          });
        }
      });
    }
  }
}
