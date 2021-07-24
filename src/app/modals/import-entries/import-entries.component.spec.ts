import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEntriesComponent } from './import-entries.component';

describe('ImportEntriesComponent', () => {
  let component: ImportEntriesComponent;
  let fixture: ComponentFixture<ImportEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
