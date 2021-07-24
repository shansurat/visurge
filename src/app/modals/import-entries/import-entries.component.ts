import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-import-entries',
  templateUrl: './import-entries.component.html',
  styleUrls: ['./import-entries.component.scss'],
})
export class ImportEntriesComponent implements OnInit {
  entriesFormControl = new FormControl();
  constructor(public modalRef: MdbModalRef<ImportEntriesComponent>) {}

  ngOnInit(): void {}
}
