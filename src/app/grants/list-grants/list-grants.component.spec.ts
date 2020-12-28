import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGrantsComponent } from './list-grants.component';

describe('ListGrantsComponent', () => {
  let component: ListGrantsComponent;
  let fixture: ComponentFixture<ListGrantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGrantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGrantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
