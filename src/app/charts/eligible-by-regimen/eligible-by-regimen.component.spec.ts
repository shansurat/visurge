import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleByRegimenComponent } from './eligible-by-regimen.component';

describe('EligibleByRegimenComponent', () => {
  let component: EligibleByRegimenComponent;
  let fixture: ComponentFixture<EligibleByRegimenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EligibleByRegimenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleByRegimenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
