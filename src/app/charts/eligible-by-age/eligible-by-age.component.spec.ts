import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByAgeComponent } from './eligible-by-age.component';

describe('EligibleByAgeComponent', () => {
  let component: EligibleByAgeComponent;
  let fixture: ComponentFixture<EligibleByAgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByAgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
