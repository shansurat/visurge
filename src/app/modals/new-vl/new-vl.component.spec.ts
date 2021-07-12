import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVlComponent } from './new-vl.component';

describe('NewVlComponent', () => {
  let component: NewVlComponent;
  let fixture: ComponentFixture<NewVlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewVlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
