import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntryFacilityComponent } from './edit-entry-facility.component';

describe('EditEntryFacilityComponent', () => {
  let component: EditEntryFacilityComponent;
  let fixture: ComponentFixture<EditEntryFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEntryFacilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntryFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
