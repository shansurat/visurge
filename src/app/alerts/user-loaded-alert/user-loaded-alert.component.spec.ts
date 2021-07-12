import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoadedAlertComponent } from './user-loaded-alert.component';

describe('UserLoadedAlertComponent', () => {
  let component: UserLoadedAlertComponent;
  let fixture: ComponentFixture<UserLoadedAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLoadedAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoadedAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
