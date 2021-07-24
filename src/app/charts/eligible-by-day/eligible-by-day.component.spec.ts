import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByDayComponent } from './eligible-by-day.component';

describe('EligibleByDayComponent', () => {
  let component: EligibleByDayComponent;
  let fixture: ComponentFixture<EligibleByDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
