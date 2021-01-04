import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicExpanderComponent } from './magic-expander.component';

describe('MagicExpanderComponent', () => {
  let component: MagicExpanderComponent;
  let fixture: ComponentFixture<MagicExpanderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagicExpanderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MagicExpanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
