import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEntriesPreviewComponent } from './import-entries-preview.component';

describe('ImportEntriesPreviewComponent', () => {
  let component: ImportEntriesPreviewComponent;
  let fixture: ComponentFixture<ImportEntriesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportEntriesPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEntriesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
