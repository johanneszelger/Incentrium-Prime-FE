import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyProgramComponent } from './copy-program.component';

describe('CopyProgramComponent', () => {
  let component: CopyProgramComponent;
  let fixture: ComponentFixture<CopyProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyProgramComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
