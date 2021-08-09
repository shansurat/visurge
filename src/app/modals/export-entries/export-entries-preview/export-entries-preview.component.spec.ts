import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEntriesPreviewComponent } from './export-entries-preview.component';

describe('ExportEntriesPreviewComponent', () => {
  let component: ExportEntriesPreviewComponent;
  let fixture: ComponentFixture<ExportEntriesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportEntriesPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportEntriesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
