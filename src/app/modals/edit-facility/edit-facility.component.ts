import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { EMPTY, of } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { Facility } from 'src/app/interfaces/facility';

@Component({
  selector: 'app-edit-facility',
  templateUrl: './edit-facility.component.html',
  styleUrls: ['./edit-facility.component.scss'],
})
export class EditFacilityComponent implements OnInit {
  existingFacility!: Facility;

  isLoading!: boolean;
  editFacilityFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    public modalRef: MdbModalRef<EditFacilityComponent>
  ) {}

  get site() {
    return this.editFacilityFormGroup.get('site') as FormControl;
  }

  get code() {
    return this.editFacilityFormGroup.get('code') as FormControl;
  }

  get isOldValue(): boolean {
    const old = this.existingFacility;
    const { site, code, state } = this.editFacilityFormGroup.value;
    return old.site == site && old.code == code && old.state == state;
  }

  ngOnInit(): void {
    this.editFacilityFormGroup = this.fb.group({
      site: [
        this.existingFacility.site,
        [Validators.required],
        [this.siteExistence()],
      ],
      code: [
        this.existingFacility.code,
        [Validators.required],
        [this.codeExistence()],
      ],

      state: [this.existingFacility.state, [Validators.required]],
    });
  }

  resetForm() {
    this.editFacilityFormGroup.reset({
      site: this.existingFacility.site,
      code: this.existingFacility.code,
      state: this.existingFacility.state,
    });
  }

  updateFacility() {
    this.isLoading = true;
    const facilityRef = this.afs
      .collection('facilities')
      .doc(this.existingFacility.uid);

    facilityRef
      .set(this.editFacilityFormGroup.value, { merge: true })
      .then(() => {
        this.modalRef.close();
      });
  }

  // Asynchronous Validators
  siteExistence() {
    return (control: FormControl) =>
      control.value == this.existingFacility.site
        ? of(null)
        : this.afs
            .collection('facilities', (ref) =>
              ref.where('site', '==', control.value)
            )
            .get()
            .pipe(
              take(1),
              map((res) =>
                res.docs.length ? { siteAlreadyExists: true } : null
              )
            );
  }

  codeExistence() {
    return (control: FormControl) =>
      control.value == this.existingFacility.code
        ? of(null)
        : this.afs
            .collection('facilities', (ref) =>
              ref.where('code', '==', control.value)
            )
            .get()
            .pipe(
              take(1),
              map((res) =>
                res.docs.length ? { codeAlreadyExists: true } : null
              )
            );
  }
}
