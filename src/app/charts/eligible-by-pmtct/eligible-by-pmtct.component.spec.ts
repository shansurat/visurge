import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByPMTCTComponent } from './eligible-by-pmtct.component';

describe('EligibleByPMTCTComponent', () => {
  let component: EligibleByPMTCTComponent;
  let fixture: ComponentFixture<EligibleByPMTCTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByPMTCTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByPMTCTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
