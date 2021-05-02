import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestingTableComponent } from './vesting-table.component';

describe('VestingTableComponent', () => {
  let component: VestingTableComponent;
  let fixture: ComponentFixture<VestingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VestingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VestingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
