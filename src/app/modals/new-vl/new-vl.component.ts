import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ViralLoadEntry } from 'src/app/interfaces/viral-load-entry';

@Component({
  selector: 'app-new-vl',
  templateUrl: './new-vl.component.html',
  styleUrls: ['./new-vl.component.scss'],
})
export class NewVlComponent implements OnInit {
  newVLFormGroup!: FormGroup;

  constructor(
    public modalRef: MdbModalRef<NewVlComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.newVLFormGroup = this.fb.group({
      value: ['', Validators.required],
      dateSampleCollected: ['', Validators.required],
    });
  }

  addVL() {
    this.modalRef.close(this.newVLFormGroup.value);
  }
}
