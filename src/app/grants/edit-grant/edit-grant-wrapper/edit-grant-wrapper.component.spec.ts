import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantWrapperComponent } from './edit-grant-wrapper.component';

describe('EditGrantWrapperComponent', () => {
  let component: EditGrantWrapperComponent;
  let fixture: ComponentFixture<EditGrantWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
