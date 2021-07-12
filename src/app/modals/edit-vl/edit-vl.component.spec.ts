import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVlComponent } from './edit-vl.component';

describe('EditVlComponent', () => {
  let component: EditVlComponent;
  let fixture: ComponentFixture<EditVlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
