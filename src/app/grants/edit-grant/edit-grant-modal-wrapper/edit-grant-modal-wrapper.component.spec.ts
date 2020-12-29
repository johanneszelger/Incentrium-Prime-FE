import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantModalWrapperComponent } from './edit-grant-modal-wrapper.component';

describe('EditGrantModalWrapperComponent', () => {
  let component: EditGrantModalWrapperComponent;
  let fixture: ComponentFixture<EditGrantModalWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantModalWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantModalWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
