import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ViralLoadEntry } from 'src/app/interfaces/viral-load-entry';

@Component({
  selector: 'app-new-vl',
  templateUrl: './new-vl.component.html',
  styleUrls: ['./new-vl.component.scss'],
})
export class NewVlComponent implements OnInit {
  newVLFormGroup!: FormGroup;
  maxDate = new Date();

  constructor(
    public modalRef: MdbModalRef<NewVlComponent>,
    private fb: FormBuilder
  ) {
    let today = new Date();
    this.maxDate.setDate(today.getDate() + 1);
  }

  ngOnInit(): void {
    this.newVLFormGroup = this.fb.group({
      value: ['', [Validators.required, Validators.min(0)]],
      dateSampleCollected: ['', Validators.required],
      undetectableViralLoad: [''],
    });

    this.newVLFormGroup
      .get('undetectableViralLoad')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((undetectableViralLoad) => {
        if (undetectableViralLoad) {
          this.newVLFormGroup.get('value')?.disable();
          this.newVLFormGroup.get('value')?.reset();
        } else {
          this.newVLFormGroup.get('value')?.enable();
        }
      });

    this.newVLFormGroup
      .get('value')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((val: number) => {
        if (val) {
          this.newVLFormGroup.get('undetectableViralLoad')?.disable();
          this.newVLFormGroup.get('undetectableViralLoad')?.reset();
        } else {
          this.newVLFormGroup.get('undetectableViralLoad')?.enable();
        }
      });
  }

  addVL() {
    this.modalRef.close(this.newVLFormGroup.value);
  }
}
