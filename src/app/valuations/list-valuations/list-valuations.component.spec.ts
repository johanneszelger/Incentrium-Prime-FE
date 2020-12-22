import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValuationsComponent } from './list-valuations.component';

describe('ListValuationsComponent', () => {
  let component: ListValuationsComponent;
  let fixture: ComponentFixture<ListValuationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListValuationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListValuationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
