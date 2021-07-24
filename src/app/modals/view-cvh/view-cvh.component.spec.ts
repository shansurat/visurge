import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCvhComponent } from './view-cvh.component';

describe('ViewCvhComponent', () => {
  let component: ViewCvhComponent;
  let fixture: ComponentFixture<ViewCvhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCvhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCvhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
