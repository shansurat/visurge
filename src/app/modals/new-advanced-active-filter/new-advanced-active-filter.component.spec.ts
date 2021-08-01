import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdvancedActiveFilterComponent } from './new-advanced-active-filter.component';

describe('NewAdvancedActiveFilterComponent', () => {
  let component: NewAdvancedActiveFilterComponent;
  let fixture: ComponentFixture<NewAdvancedActiveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAdvancedActiveFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAdvancedActiveFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
