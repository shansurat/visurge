import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntryUanComponent } from './edit-entry-uan.component';

describe('EditEntryUanComponent', () => {
  let component: EditEntryUanComponent;
  let fixture: ComponentFixture<EditEntryUanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEntryUanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEntryUanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
