import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByMonthComponent } from './eligible-by-month.component';

describe('EligibleByMonthComponent', () => {
  let component: EligibleByMonthComponent;
  let fixture: ComponentFixture<EligibleByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
