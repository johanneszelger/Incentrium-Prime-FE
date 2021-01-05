import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewValuationComponent } from './view-valuation.component';

describe('ViewValuationComponent', () => {
  let component: ViewValuationComponent;
  let fixture: ComponentFixture<ViewValuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewValuationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
