import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ViralLoadEntry } from 'src/app/interfaces/viral-load-entry';

@Component({
  selector: 'app-edit-vl',
  templateUrl: './edit-vl.component.html',
  styleUrls: ['./edit-vl.component.scss'],
})
export class EditVlComponent implements OnInit {
  vl!: ViralLoadEntry;
  dateSampleCollected!: Date;
  editVLFormGroup!: FormGroup;
  maxDate = new Date();
  _isSameDay!: Observable<boolean>;

  constructor(
    public modalRef: MdbModalRef<EditVlComponent>,
    private fb: FormBuilder
  ) {
    let today = new Date();
    this.maxDate.setDate(today.getDate() + 1);
    this.editVLFormGroup = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      dateSampleCollected: ['', Validators.required],
      undetectableViralLoad: [''],
    });
  }

  ngOnInit(): void {
    this.editVLFormGroup.patchValue(this.vl);

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

    this._isSameDay = (
      this.editVLFormGroup.get('dateSampleCollected') as FormControl
    )?.valueChanges.pipe(
      distinctUntilChanged(),
      map((date) => this.isSameDay(date, this.vl.dateSampleCollected))
    );

    this.editVLFormGroup.patchValue(this.vl);
  }

  updateVL() {
    this.modalRef.close(this.editVLFormGroup.value);
  }

  isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
