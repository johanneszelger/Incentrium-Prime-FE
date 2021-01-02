import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Grant} from '../../models/grant.model';
import {ProgramService} from '../../services/program.service';
import {GrantService} from '../../services/grant.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'inc-list-grants',
  templateUrl: './list-grants.component.html',
  styleUrls: ['./list-grants.component.scss']
})
export class ListGrantsComponent implements OnInit, AfterViewInit {
  grants: Array<Grant>;
  private loading = false;

  constructor(private grantService: GrantService,
              private messageService: MessageService) { }

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

  copiedGrant($event: void) {
    
  }
}
