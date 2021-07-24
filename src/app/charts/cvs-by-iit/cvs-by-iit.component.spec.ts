import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvsByIitComponent } from './cvs-by-iit.component';

describe('CvsByIitComponent', () => {
  let component: CvsByIitComponent;
  let fixture: ComponentFixture<CvsByIitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvsByIitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvsByIitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
