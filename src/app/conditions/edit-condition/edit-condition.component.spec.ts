import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConditionComponent } from './edit-condition.component';

describe('EditConditionComponent', () => {
  let component: EditConditionComponent;
  let fixture: ComponentFixture<EditConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
