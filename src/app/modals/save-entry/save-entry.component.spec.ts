import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveEntryComponent } from './save-entry.component';

describe('SaveEntryComponent', () => {
  let component: SaveEntryComponent;
  let fixture: ComponentFixture<SaveEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
