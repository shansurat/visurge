import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViralLoadCoverageComponent } from './viral-load-coverage.component';

describe('ViralLoadCoverageComponent', () => {
  let component: ViralLoadCoverageComponent;
  let fixture: ComponentFixture<ViralLoadCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViralLoadCoverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViralLoadCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
