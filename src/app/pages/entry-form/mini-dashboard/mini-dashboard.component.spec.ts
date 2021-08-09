import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniDashboardComponent } from './mini-dashboard.component';

describe('MiniDashboardComponent', () => {
  let component: MiniDashboardComponent;
  let fixture: ComponentFixture<MiniDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
