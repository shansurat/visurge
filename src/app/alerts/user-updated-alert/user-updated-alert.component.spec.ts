import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdatedAlertComponent } from './user-updated-alert.component';

describe('UserUpdatedAlertComponent', () => {
  let component: UserUpdatedAlertComponent;
  let fixture: ComponentFixture<UserUpdatedAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUpdatedAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdatedAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
