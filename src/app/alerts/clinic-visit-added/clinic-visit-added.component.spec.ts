import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicVisitAddedComponent } from './clinic-visit-added.component';

describe('ClinicVisitAddedComponent', () => {
  let component: ClinicVisitAddedComponent;
  let fixture: ComponentFixture<ClinicVisitAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicVisitAddedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicVisitAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
