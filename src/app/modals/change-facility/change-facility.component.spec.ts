import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeFacilityComponent } from './change-facility.component';

describe('ChangeFacilityComponent', () => {
  let component: ChangeFacilityComponent;
  let fixture: ComponentFixture<ChangeFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
