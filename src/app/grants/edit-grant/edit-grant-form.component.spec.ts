import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantForm } from './edit-grant-form.component';

describe('EditGrantComponent', () => {
  let component: EditGrantForm;
  let fixture: ComponentFixture<EditGrantForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantForm ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
