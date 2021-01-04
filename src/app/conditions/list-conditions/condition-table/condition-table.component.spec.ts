import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionTableComponent } from './condition-table.component';

describe('ConditionTableComponent', () => {
  let component: ConditionTableComponent;
  let fixture: ComponentFixture<ConditionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
