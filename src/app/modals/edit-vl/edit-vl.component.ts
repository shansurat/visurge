import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-edit-vl',
  templateUrl: './edit-vl.component.html',
  styleUrls: ['./edit-vl.component.scss'],
})
export class EditVlComponent implements OnInit {
  value!: string;
  dateSampleCollected!: Date;
  editVLFormGroup!: FormGroup;

  constructor(
    public modalRef: MdbModalRef<EditVlComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editVLFormGroup = this.fb.group({
      value: [this.value, Validators.required],
      dateSampleCollected: [this.dateSampleCollected, Validators.required],
    });
  }

  updateVL() {
    this.modalRef.close(this.editVLFormGroup.value);
  }
}
