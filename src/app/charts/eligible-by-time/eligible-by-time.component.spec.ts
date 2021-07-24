import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByTimeComponent } from './eligible-by-time.component';

describe('EligibleByTimeComponent', () => {
  let component: EligibleByTimeComponent;
  let fixture: ComponentFixture<EligibleByTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
