import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-view-vlh',
  templateUrl: './view-vlh.component.html',
  styleUrls: ['./view-vlh.component.scss'],
})
export class ViewVlhComponent implements OnInit {
  vlh!: any[];
  headers = ['#', 'Category', 'Value', 'Date Sample Collected'];
  constructor(public modalRef: MdbModalRef<ViewVlhComponent>) {}

  ngOnInit(): void {}
}
