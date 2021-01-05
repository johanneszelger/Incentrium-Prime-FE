import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateValuationComponent } from './create-valuation.component';

describe('CreateValuationComponent', () => {
  let component: CreateValuationComponent;
  let fixture: ComponentFixture<CreateValuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateValuationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
