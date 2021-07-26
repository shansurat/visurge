import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFacilityComponent } from './new-facility.component';

describe('NewFacilityComponent', () => {
  let component: NewFacilityComponent;
  let fixture: ComponentFixture<NewFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
