import { Component, OnInit } from '@angular/core';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'entry-form-mini-dashboard',
  templateUrl: './mini-dashboard.component.html',
  styleUrls: ['./mini-dashboard.component.scss'],
})
export class MiniDashboardComponent implements OnInit {
  constructor(public entriesServ: EntriesService) {}

  ngOnInit(): void {}
}
