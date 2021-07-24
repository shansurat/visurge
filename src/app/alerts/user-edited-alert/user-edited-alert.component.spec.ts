import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditedALertComponent } from './user-edited-alert.component';

describe('UserEditedALertComponent', () => {
  let component: UserEditedALertComponent;
  let fixture: ComponentFixture<UserEditedALertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEditedALertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditedALertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
