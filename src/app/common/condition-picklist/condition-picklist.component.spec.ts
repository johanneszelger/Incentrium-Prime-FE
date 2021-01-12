import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionPicklistComponent } from './condition-picklist.component';

describe('ConditionPicklistComponent', () => {
  let component: ConditionPicklistComponent;
  let fixture: ComponentFixture<ConditionPicklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionPicklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionPicklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
