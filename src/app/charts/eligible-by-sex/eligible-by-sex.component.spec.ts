import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleBySexComponent } from './eligible-by-sex.component';

describe('EligibleBySexComponent', () => {
  let component: EligibleBySexComponent;
  let fixture: ComponentFixture<EligibleBySexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleBySexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleBySexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
