import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject } from 'rxjs';
import { fields } from 'src/app/constants/entry-fields';
import { getRegimenByCode } from 'src/app/functions/getRegimenByCode';

@Component({
  selector: 'app-export-entries-preview',
  templateUrl: './export-entries-preview.component.html',
  styleUrls: ['./export-entries-preview.component.scss'],
})
export class ExportEntriesPreviewComponent implements OnInit {
  data!: BehaviorSubject<any[]>;
  headers!: { header: string; field: string }[];

  config = {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    wheelSpeed: 1,
    wheelPropagation: true,
    swipeEasing: true,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    scrollingThreshold: 1000,
    useBothWheelAxes: false,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
  };

  fields = fields;
  getRegimenByCode = getRegimenByCode;

  constructor(public modalRef: MdbModalRef<ExportEntriesPreviewComponent>) {}

  ngOnInit(): void {}
}
