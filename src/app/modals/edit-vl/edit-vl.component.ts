import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-edit-vl',
  templateUrl: './edit-vl.component.html',
  styleUrls: ['./edit-vl.component.scss'],
})
export class EditVlComponent implements OnInit {
  value!: string;
  dateSampleCollected!: Date;
  editVLFormGroup!: FormGroup;
  maxDate = new Date();

  constructor(
    public modalRef: MdbModalRef<EditVlComponent>,
    private fb: FormBuilder
  ) {
    let today = new Date();
    this.maxDate.setDate(today.getDate() + 1);
  }

  ngOnInit(): void {
    this.editVLFormGroup = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      dateSampleCollected: ['', Validators.required],
      undetectableViralLoad: [''],
    });

    this.editVLFormGroup
      .get('undetectableViralLoad')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((undetectableViralLoad) => {
        if (undetectableViralLoad) {
          this.editVLFormGroup.get('value')?.disable();
          this.editVLFormGroup.get('value')?.reset();
        } else {
          this.editVLFormGroup.get('value')?.enable();
        }
      });

    this.editVLFormGroup
      .get('value')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((val: number) => {
        if (val) {
          this.editVLFormGroup.get('undetectableViralLoad')?.disable();
          this.editVLFormGroup.get('undetectableViralLoad')?.reset();
        } else {
          this.editVLFormGroup.get('undetectableViralLoad')?.enable();
        }
      });
  }

  updateVL() {
    this.modalRef.close(this.editVLFormGroup.value);
  }
}
