import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedLoadingCardComponent } from './animated-loading-card.component';

describe('AnimatedCardComponent', () => {
  let component: AnimatedLoadingCardComponent;
  let fixture: ComponentFixture<AnimatedLoadingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatedLoadingCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedLoadingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
