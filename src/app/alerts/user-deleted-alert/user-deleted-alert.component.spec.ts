import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeletedAlertComponent } from './user-deleted-alert.component';

describe('UserDeletedAlertComponent', () => {
  let component: UserDeletedAlertComponent;
  let fixture: ComponentFixture<UserDeletedAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDeletedAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeletedAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
