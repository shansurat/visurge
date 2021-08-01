import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-save-entry',
  templateUrl: './save-entry.component.html',
  styleUrls: ['./save-entry.component.scss'],
})
export class SaveEntryComponent implements OnInit {
  UAN!: string;

  constructor(public modalRef: MdbModalRef<SaveEntryComponent>) {}

  ngOnInit(): void {}
}
