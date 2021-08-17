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
import { debounceTime, map, take } from 'rxjs/operators';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'app-new-facility',
  templateUrl: './new-facility.component.html',
  styleUrls: ['./new-facility.component.scss'],
})
export class NewFacilityComponent implements OnInit {
  isLoading!: boolean;
  newFacilityFormGroup!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    public modalRef: MdbModalRef<NewFacilityComponent>,
    private facilitiesServ: FacilitiesService,
    private notifServ: MdbNotificationService
  ) {}

  ngOnInit(): void {
    this.newFacilityFormGroup = this.fb.group({
      site: [
        '',
        [Validators.required],
        [NewFacilityValidators.siteExistence(this.afs)],
      ],
      code: [
        '',
        [Validators.required],
        [NewFacilityValidators.codeExistence(this.afs)],
      ],

      state: ['', [Validators.required]],
    });
  }

  addFacility() {
    this.isLoading = true;
    const facilityRef = this.afs.collection('facilities').doc();
    const uid = facilityRef.ref.id;

    facilityRef.set({ ...this.newFacilityFormGroup.value, uid }).then(() => {
      this.modalRef.close();
    });
  }
}

export class NewFacilityValidators {
  // Synchronous Validators
  static usernameValidity() {
    return (control: FormControl) => {
      const username: string = control.value;

      return username.match(/^[a-z0-9]+$/i) ? null : { notUsername: true };
    };
  }

  // Asynchronous Validators
  static siteExistence(afs: AngularFirestore) {
    return (control: FormControl) => {
      const site: string = control.value;

      return afs
        .collection('facilities', (ref) => ref.where('site', '==', site))
        .valueChanges()
        .pipe(
          debounceTime(250),
          take(1),
          map((res) => {
            return res.length ? { siteAlreadyExists: true } : null;
          })
        );
    };
  }

  static codeExistence(afs: AngularFirestore) {
    return (control: FormControl) => {
      const code: string = control.value;

      return afs
        .collection('facilities', (ref) => ref.where('code', '==', code))
        .valueChanges()
        .pipe(
          debounceTime(250),
          take(1),
          map((res) => {
            return res.length ? { codeAlreadyExists: true } : null;
          })
        );
    };
  }
}
