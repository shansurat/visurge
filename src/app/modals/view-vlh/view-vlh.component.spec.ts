import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVlhComponent } from './view-vlh.component';

describe('ViewVlhComponent', () => {
  let component: ViewVlhComponent;
  let fixture: ComponentFixture<ViewVlhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVlhComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVlhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
