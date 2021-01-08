import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {ProgramService} from '../../services/program.service';
import {GrantService} from '../../services/grant.service';
import {MessageService} from 'primeng/api';
import {Program} from '../../models/program.model';
import {Router} from '@angular/router';

@Component({
  selector: 'inc-list-grants',
  templateUrl: './list-grants.component.html',
  styleUrls: ['./list-grants.component.scss']
})
export class ListGrantsComponent implements OnInit, AfterViewInit {
  grants: Array<Grant>;
  loading = false;

  constructor(private grantService: GrantService,
              private messageService: MessageService,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.grantService.list().subscribe(
      data => {
        this.grants = data;
        this.loading = false;
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not load grants', detail: ''});
        }
        this.loading = false;
      }
    );
  }

  copyGrant(grant: Grant): void {
    this.grantService.save(grant).subscribe(
      data => {
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Copied and saved grant', detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not copy grant', detail: ''});
        }
        this.grants = this.grants.filter(g => g !== grant);
      }
    );
  }

  deletedGrants(grants: Array<Grant>): void {
    this.grantService.delete(grants.map(g => g.id)).subscribe(
      data => {
        this.messageService.add({key: 'toast', severity: 'success', summary: 'Deleted Grant(s)', detail: ''});
      },
      error => {
        if (error) {
          this.messageService.add({key: 'toast', severity: 'error', summary: 'Could not delete Grant(s)', detail: ''});
        }
        const newArray = new Array<Grant>();
        this.grants.forEach(g => newArray.push(g));
        grants.forEach(g => newArray.push(g));
        this.grants = newArray;
      }
    );
  }

  editGrant(grant: Grant = new Grant()): void {
      this.router.navigate(['/editgrant/'],  { queryParams: { grantId: grant.id } });
  }
}
