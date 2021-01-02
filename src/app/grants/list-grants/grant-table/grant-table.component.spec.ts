import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantTableComponent } from './grant-table.component';

describe('GrantTableComponent', () => {
  let component: GrantTableComponent;
  let fixture: ComponentFixture<GrantTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrantTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
