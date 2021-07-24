import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByWeekComponent } from './eligible-by-week.component';

describe('EligibleByWeekComponent', () => {
  let component: EligibleByWeekComponent;
  let fixture: ComponentFixture<EligibleByWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
