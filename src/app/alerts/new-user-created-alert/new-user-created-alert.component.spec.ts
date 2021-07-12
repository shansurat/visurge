import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserCreatedAlertComponent } from './new-user-created-alert.component';

describe('NewUserCreatedAlertComponent', () => {
  let component: NewUserCreatedAlertComponent;
  let fixture: ComponentFixture<NewUserCreatedAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewUserCreatedAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserCreatedAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
