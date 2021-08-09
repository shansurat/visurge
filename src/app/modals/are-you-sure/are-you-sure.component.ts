import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-are-you-sure',
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.scss'],
})
export class AreYouSureComponent implements OnInit {
  title!: string;
  context!: string;

  constructor(public modalRef: MdbModalRef<AreYouSureComponent>) {}

  ngOnInit(): void {}
}
