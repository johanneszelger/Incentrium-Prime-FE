import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestingInputTableComponent } from './vesting-input-table.component';

describe('VestingInputTableComponent', () => {
  let component: VestingInputTableComponent;
  let fixture: ComponentFixture<VestingInputTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VestingInputTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VestingInputTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
