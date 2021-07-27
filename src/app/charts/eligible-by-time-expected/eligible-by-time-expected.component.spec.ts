import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByTimeExpectedComponent } from './eligible-by-time-expected.component';

describe('EligibleByTimeExpectedComponent', () => {
  let component: EligibleByTimeExpectedComponent;
  let fixture: ComponentFixture<EligibleByTimeExpectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByTimeExpectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByTimeExpectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
