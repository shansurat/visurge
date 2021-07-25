import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbStepperOrientation } from 'mdb-angular-ui-kit/stepper';
import {
  of,
  Subject,
  Subscription,
  timer,
  fromEvent,
  Observable,
  combineLatest,
  EMPTY,
  BehaviorSubject,
  zip,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  share,
  switchMap,
} from 'rxjs/operators';
import { UserLoadedAlertComponent } from 'src/app/alerts/user-loaded-alert/user-loaded-alert.component';
import { ClinicVisitEntry } from 'src/app/interfaces/clinic-visit-entry';
import { UserEntry } from 'src/app/interfaces/user-entry';
import { ViralLoadEntry } from 'src/app/interfaces/viral-load-entry';
import { EditVlComponent } from 'src/app/modals/edit-vl/edit-vl.component';
import { NewVlComponent } from 'src/app/modals/new-vl/new-vl.component';
import { ViewCvhComponent } from 'src/app/modals/view-cvh/view-cvh.component';
import {
  ageCategories,
  regimens,
  regimensByGroup,
} from '../../constants/regimens';
import firebase from 'firebase/app';
import { UserUpdatedAlertComponent } from 'src/app/alerts/user-updated-alert/user-updated-alert.component';
import { facilities } from 'src/app/constants/facilities';
import { clinicComments } from 'src/app/constants/clinicComments';
import { AuthService } from 'src/app/services/auth.service';
import {
  getEligibilityStatus,
  getIITStatus,
} from 'src/app/functions/getStatus';
import { EligibilityStatus } from 'src/app/interfaces/eligibility-status';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EntriesService } from 'src/app/services/entries.service';

import { slideInRightAnimation } from 'mdb-angular-ui-kit/animations';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideInRightAnimation()],
})
export class EntryFormComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  entriesAutocomplete$!: Observable<any[]>;

  newEntry: boolean = true;

  time = new Date();
  rxTime = new Date();
  intervalId!: any;
  timeSubscription!: Subscription;

  // Status
  eligibilityStatus!: EligibilityStatus | null;
  iit!: string | null;
  nextViralLoadSampleCollectionDate!: {
    date: Date;
    rotation: any;
  };

  // Constants
  regimens = regimens;
  regimensByGroup = regimensByGroup;
  ageCategories = ageCategories;
  clinicComments = clinicComments;
  facilities = facilities;

  facilityName = 'Philippines - Reg IV';

  // Arrays
  vlh: ViralLoadEntry[] = [];
  cvh!: Observable<ClinicVisitEntry[]>;

  entryDate!: Date;

  // FormControls
  entryFormGroup!: FormGroup;
  clinicVisitFormGroup!: FormGroup;
  uniqueARTNumberFormControl!: FormControl;
  noViralLoadHasBeenDoneFormControl: FormControl = new FormControl();
  pendingStatusFormControl: FormControl = new FormControl();
  currentErr: Subject<any> = new Subject();

  vlhUpdated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  maxDate = new Date();

  miniDashboardShown!: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalServ: MdbModalService,
    private afs: AngularFirestore,
    private notifServ: MdbNotificationService,
    private authServ: AuthService,
    private pushNotifServ: PushNotificationService,
    public entriesServ: EntriesService
  ) {
    let today = new Date();
    this.maxDate.setDate(today.getDate() + 1);

    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.timeSubscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe((time) => {
        this.rxTime = time;
      });
  }

  ngOnInit(): void {
    // Unique ART Number Form Control initialization
    this.uniqueARTNumberFormControl = new FormControl('', [
      Validators.required,
      EntryFormValidators.UANValidity(),
    ]);

    // Entry Form Group initialization
    this.entryFormGroup = this.fb.group({
      sex: ['', [Validators.required]],
      birthdateKnown: [''],
      birthdate: ['', Validators.required],
      age: ['', [Validators.min(0)]],
      ageUnit: ['years'],
      phoneNumber: [''],
      ARTStartDate: ['', [Validators.required]],
      regimen: ['', [Validators.required]],
      regimenStartTransDate: ['', [Validators.required]],
      pmtct: ['', [Validators.required]],
      pmtctEnrollStartDate: [{ value: '', disabled: true }],
      hvl: ['', [Validators.required]],
      eac3Completed: [''],
      eac3CompletionDate: [{ value: '', disabled: true }],
      pendingStatusDate: [''],
    });

    // Clinic Visit Form Group initialization
    this.clinicVisitFormGroup = this.fb.group({
      lastClinicVisitDate: ['', Validators.required],
      clinicVisitComment: ['', Validators.required],
      nextAppointmentDate: [''],
      facility: [''],
      dateTransferred: [''],
    });

    let UAN$ = this.uniqueARTNumberFormControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged()
    );

    // Entries Autocomplete for UAN
    this.entriesAutocomplete$ = UAN$.pipe(
      mergeMap(async (UAN: string) => {
        return (
          await this.afs.collection('entries').get().toPromise()
        ).docs.filter((entry) =>
          (entry.data() as UserEntry).uniqueARTNumber.includes(
            UAN.toUpperCase()
          )
        );
      })
    );

    // Realtime updating Eligibility
    this.entryFormGroup.valueChanges.subscribe((val) => {
      console.log('FORM UPDATED');
      this.eligibilityStatus = getEligibilityStatus({
        ...val,
        vlh: this.vlh,
      });
    });
    this.noViralLoadHasBeenDoneFormControl.valueChanges.subscribe(() => {
      console.log('NIL UPDATED');
      this.eligibilityStatus = getEligibilityStatus({
        ...this.entryFormGroup.value,
        vlh: this.vlh,
      });
    });

    this.vlhUpdated.subscribe((val) => {
      if (this.vlh[0]?.value >= 1000) {
        this.entryFormGroup.get('hvl')?.setValue('yes');
      }

      this.eligibilityStatus = getEligibilityStatus({
        ...this.entryFormGroup.value,
        vlh: this.vlh,
      });
    });

    // Realtime updating IIT Status
    this.clinicVisitFormGroup.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((cv: ClinicVisitEntry) => {
        this.iit = getIITStatus(cv.nextAppointmentDate);
      });

    //  Birthdate Know checkbox listener
    this.entryFormGroup
      .get('birthdateKnown')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((birthDateKnown) => {
        if (birthDateKnown) {
          this.entryFormGroup.get('age')?.reset();
          this.entryFormGroup.get('age')?.clearValidators();
          this.entryFormGroup.get('ageUnit')?.reset();
          this.entryFormGroup.get('ageUnit')?.clearValidators();
          this.entryFormGroup
            .get('birthdate')
            ?.setValidators([Validators.required]);
        } else {
          this.entryFormGroup.get('birthdate')?.reset();
          this.entryFormGroup.get('birthdate')?.clearValidators();
          this.entryFormGroup.get('age')?.setValidators([Validators.required]);
          this.entryFormGroup
            .get('ageUnit')
            ?.setValidators([Validators.required]);
        }
      });

    // Sex field listener
    const sex$ = this.entryFormGroup.get('sex')?.valueChanges.pipe(
      distinctUntilChanged(),
      map((sex: string) => {
        if (sex == 'male') {
          this.entryFormGroup.get('pmtct')?.setValue('no');
          this.entryFormGroup.get('pmtct')?.disable();
        } else {
          this.entryFormGroup.get('pmtct')?.enable();
          this.entryFormGroup.get('pmtct')?.reset();
        }
      })
    );
    let sexSubscription = sex$?.subscribe();

    // PMTCT field listener
    const pmtct$ = this.entryFormGroup.get('pmtct')?.valueChanges.pipe(
      distinctUntilChanged(),
      map((pmtct: string) => {
        if (pmtct == 'yes') {
          this.entryFormGroup.get('pmtctEnrollStartDate')?.enable();
          this.entryFormGroup
            .get('pmtctEnrollStartDate')
            ?.setValidators([Validators.required]);
        } else {
          this.entryFormGroup.get('pmtctEnrollStartDate')?.clearValidators();
          this.entryFormGroup.get('pmtctEnrollStartDate')?.reset();
          this.entryFormGroup.get('pmtctEnrollStartDate')?.disable();
        }
      })
    );
    let pmtctSubscription = pmtct$?.subscribe();

    // HVL field listener
    const hvl$ = this.entryFormGroup.get('hvl')?.valueChanges.pipe(
      distinctUntilChanged(),
      map((hvl) => {
        if (hvl == 'yes') {
          this.entryFormGroup.get('eac3Completed')?.enable();
          this.entryFormGroup
            .get('eac3Completed')
            ?.setValidators([Validators.required]);
          this.noViralLoadHasBeenDoneFormControl.reset();
          this.noViralLoadHasBeenDoneFormControl.disable();
        } else {
          this.entryFormGroup.get('eac3Completed')?.clearValidators();
          this.entryFormGroup.get('eac3Completed')?.reset();
          this.entryFormGroup.get('eac3Completed')?.disable();
          this.noViralLoadHasBeenDoneFormControl.enable();
        }
      })
    );
    let hvlSubscription = hvl$?.subscribe();

    // EAC-3 Completed field listener
    const eac3Completed$ = this.entryFormGroup
      .get('eac3Completed')
      ?.valueChanges.pipe(
        distinctUntilChanged(),
        map((eac3Completed) => {
          if (eac3Completed == 'yes') {
            this.entryFormGroup.get('eac3CompletionDate')?.enable();
            this.entryFormGroup
              .get('eac3CompletionDate')
              ?.setValidators([Validators.required]);
          } else {
            this.entryFormGroup.get('eac3CompletionDate')?.clearValidators();
            this.entryFormGroup.get('eac3CompletionDate')?.reset();
            this.entryFormGroup.get('eac3CompletionDate')?.disable();
          }
        })
      );
    let eac3CompletedSubscription = eac3Completed$?.subscribe();

    // Clinic Visit Comment field listener
    this.clinicVisitFormGroup.get('clinicVisitComment')?.valueChanges.pipe(
      map((clinicVisitComment: string) => {
        if (clinicVisitComment.includes('Transfer')) {
          this.clinicVisitFormGroup
            .get('facility')
            ?.setValidators([Validators.required]);
          this.clinicVisitFormGroup
            .get('dateTransferred')
            ?.setValidators([Validators.required]);
        } else {
          this.clinicVisitFormGroup.get('facility')?.clearValidators();
          this.clinicVisitFormGroup.get('dateTransferred')?.clearValidators();
        }
      })
    );

    // Pending Status checkbox listener
    this.pendingStatusFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        map((pendingStatus) => {
          const pendingStatusDate =
            this.entryFormGroup.get('pendingStatusDate');
          if (pendingStatus) {
            pendingStatusDate?.setValidators([Validators.required]);
          } else {
            pendingStatusDate?.reset();
            pendingStatusDate?.clearValidators();
          }
        })
      )
      .subscribe();

    // Selected entry observable
    const selectedUserEntry$ = UAN$.pipe(
      mergeMap((uniqueARTNumber: string): any => {
        return uniqueARTNumber
          ? this.afs.collection('entries').doc(UANToId(uniqueARTNumber)).get()
          : of(null);
      }),
      map((entry: any) => {
        return entry?.exists ? entry.data() : null;
      })
    );

    // Realtime loading of existing entry
    selectedUserEntry$.subscribe((res: UserEntry | any) => {
      sexSubscription?.unsubscribe();
      pmtctSubscription?.unsubscribe();
      hvlSubscription?.unsubscribe();
      eac3CompletedSubscription?.unsubscribe();

      if (res) {
        this.newEntry = false;

        let { uniqueARTNumber, vlh, entryDate, cvh, eligibility, iit } = res;
        this.entryDate = entryDate.toDate();
        this.eligibilityStatus = eligibility;
        this.iit = iit;

        delete res.uniqueARTNumber;
        delete res.cvh;
        delete res.vlh;
        delete res.eligibility;

        res.ARTStartDate = res.ARTStartDate.toDate();
        res.birthdate = res.birthdate?.toDate();
        res.regimenStartTransDate = res.regimenStartTransDate.toDate();
        res.pmtctEnrollStartDate = res.pmtctEnrollStartDate?.toDate();
        res.eac3CompletionDate = res.eac3CompletionDate?.toDate();
        res.pendingStatusDate = res.pendingStatusDate?.toDate();

        this.entryFormGroup.reset();
        this.entryFormGroup.patchValue(res);

        // Disabling some form fields
        if (res.sex == 'male') this.entryFormGroup.get('pmtct')?.disable();
        if (res.pmtct == 'no')
          this.entryFormGroup.get('pmtctEnrollStartDate')?.disable();
        if (res.hvl == 'no')
          this.entryFormGroup.get('eac3Completed')?.disable();
        else {
          this.noViralLoadHasBeenDoneFormControl.reset();
          this.noViralLoadHasBeenDoneFormControl.disable();
        }
        if (res.eac3Completed == 'no')
          this.entryFormGroup.get('eac3CompletionDate')?.disable();

        // Seting Regimen
        this.entryFormGroup.get('regimen')?.setValue(res.regimen);

        // Setting Clinic Visit History
        if (cvh?.length) {
          let cur = cvh[cvh.length - 1];
          cur.lastClinicVisitDate = cur.lastClinicVisitDate.toDate();
          cur.nextAppointmentDate = cur.nextAppointmentDate?.toDate();

          if (cur.dateTransferred) {
            cur.dateTransferred = cur.dateTransferred?.toDate();
          }
          delete cur.iitStatus;
          this.clinicVisitFormGroup.setValue(cur);
        }

        this.cvh = cvh;

        // Setting Viral Load Entries
        this.noViralLoadHasBeenDoneFormControl.setValue(!vlh.length);
        if (vlh.length) this.noViralLoadHasBeenDoneFormControl.disable();

        vlh.forEach((entry: any) => {
          entry.dateSampleCollected = entry?.dateSampleCollected?.toDate();
        });
        this.vlh = vlh;

        this.pendingStatusFormControl.setValue(res.pendingStatusDate);

        // Pushing notification
        this.notifServ.open(UserLoadedAlertComponent, {
          autohide: true,
          data: { uniqueARTNumber: uniqueARTNumber.toUpperCase() },
        });
      } else {
        // Setting form to input new entry
        this.newEntry = true;
        this.entryFormGroup.reset();
        this.entryFormGroup.get('pmtct')?.enable();
        this.entryFormGroup.get('pmtctEnrollStartDate')?.enable();
        this.entryFormGroup.get('eac3Completed')?.enable();
        this.entryFormGroup.get('eac3CompletionDate')?.enable();
        this.noViralLoadHasBeenDoneFormControl.enable();
        this.pendingStatusFormControl.reset();
        this.clinicVisitFormGroup.reset();

        this.vlh = [];
        this.entryDate = this.time;
      }

      sexSubscription = sex$?.subscribe();
      pmtctSubscription = pmtct$?.subscribe();
      hvlSubscription = hvl$?.subscribe();
      eac3CompletedSubscription = eac3Completed$?.subscribe();
    });

    combineLatest(
      UAN$,
      this.entryFormGroup.valueChanges.pipe(distinctUntilChanged()),
      this.clinicVisitFormGroup.valueChanges.pipe(distinctUntilChanged())
    ).pipe(
      map(() => {
        const uanErr = this.uniqueARTNumberFormControl.errors;
        const entryErr = this.entryFormGroup.errors;
        const cvErr = this.clinicVisitFormGroup.errors;

        console.log(uanErr, entryErr, cvErr);

        if (uanErr?.length) {
          return this.currentErr.next(uanErr[0]);
        } else if (entryErr?.length) return this.currentErr.next(entryErr[0]);
        else if (cvErr?.length) return this.currentErr.next(cvErr[0]);

        this.currentErr.next(null);
      })
    );

    this.uniqueARTNumberFormControl.setValue(
      this.activatedRoute.snapshot.paramMap.get('UAN')
    );
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  calculateAge(val: string) {
    let today = new Date();
    let birthDate = new Date(val);
    let y = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    let d = today.getDate() - birthDate.getDate();

    if (d < 0) {
      d += new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      m--;
    }

    if (m < 0) {
      m += 12;
      y--;
    }

    if (m === 0 && today.getDate() < birthDate.getDate()) y--;

    return { years: y, months: m, days: d };
  }

  strToInt(text: string) {
    return parseInt(text);
  }

  saveEntryForm() {
    let uniqueARTNumber = this.uniqueARTNumberFormControl.value.toUpperCase();
    let data = this.newEntry
      ? {
          ...this.entryFormGroup.getRawValue(),
          vlh: this.vlh,
          uniqueARTNumber,
          entryDate: this.entryDate,
          facilityName: this.facilityName,
          eligibility: this.eligibilityStatus,
          iit: this.iit,
        }
      : {
          ...this.entryFormGroup.getRawValue(),
          vlh: this.vlh,
          eligibility: this.eligibilityStatus,
          iit: this.iit,
        };

    Object.keys(data).forEach((key) => {
      if (data[key] == undefined) data[key] = null;
    });

    let userRef = this.afs.collection('entries').doc(UANToId(uniqueARTNumber));

    userRef.set(data, { merge: true }).then(() => {
      userRef.get().subscribe((val) => {
        const cvh = (val.data() as UserEntry)?.cvh;
        const newCV = this.clinicVisitFormGroup.value as ClinicVisitEntry;

        let cur;

        if (cvh?.length) {
          cur = cvh[cvh.length - 1];

          if (cur == newCV) return;
        }
        console.log('NEWCV', newCV);

        userRef
          .update({
            cvh: firebase.firestore.FieldValue.arrayUnion({
              ...newCV,
              iitStatus: getIITStatus(newCV.nextAppointmentDate),
            }),
          })
          .then(() => {
            if (
              this.clinicVisitFormGroup
                .get('clinicVisitComment')
                ?.value?.includes('Transfer')
            ) {
              console.log('TRANSFER NOTIF');
              this.pushNotifServ.addPushNotif({
                message: `${uniqueARTNumber} ${
                  this.clinicVisitFormGroup.get('clinicVisitComment')?.value
                } ${
                  this.clinicVisitFormGroup.get('facility')?.value
                }`.toUpperCase(),
                unread: true,
                dateCreated: new Date(),
              });
            }

            this.notifServ.open(UserUpdatedAlertComponent, {
              data: { uniqueARTNumber: uniqueARTNumber.toUpperCase() },
              autohide: true,
            });
          });
      });
    });
  }

  pendingStatusUpdated(val: boolean) {
    if (!val) this.entryFormGroup.get('pendingStatusDate')?.reset();
  }

  // Viral Load Functions
  openNewVLModal() {
    let newVLModalRef = this.modalServ.open(NewVlComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });

    newVLModalRef.onClose.subscribe((vlEntry) => {
      if (vlEntry) {
        this.vlh.push(vlEntry);
        this.sortVLH();

        this.noViralLoadHasBeenDoneFormControl.reset();
        this.noViralLoadHasBeenDoneFormControl.disable();
      }
    });
  }

  openEditVLModal(i: number) {
    let editVLModalRef = this.modalServ.open(EditVlComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
      data: { vl: this.vlh[i] },
    });

    editVLModalRef.onClose.subscribe((vlEntry) => {
      if (vlEntry) {
        this.vlh[i] = vlEntry;
        this.sortVLH();
      }
    });
  }

  removeVL(i: number) {
    this.vlh.splice(i, 1);
    this.vlhUpdated.next(true);

    if (!this.vlh.length) {
      this.noViralLoadHasBeenDoneFormControl.enable();
    }
  }

  sortVLH() {
    this.vlh.sort(
      (x, y) =>
        y.dateSampleCollected.valueOf() - x.dateSampleCollected.valueOf()
    );
    this.vlhUpdated.next(true);
  }

  // Clinic Visit Functions
  viewCVH() {
    this.afs
      .collection('entries')
      .doc(UANToId(this.uniqueARTNumberFormControl.value))
      .get()
      .subscribe((res) => {
        console.log(res.data());
        this.modalServ.open(ViewCvhComponent, {
          data: {
            cvh: (res.data() as UserEntry).cvh,
            entryDate: this.entryDate,
          },
          modalClass: 'modal-dialog-centered modal-xl modal-fullscreen-md-down',
        });
      });
  }
}

function UANToId(UAN: string) {
  return UAN.replace(/\//g, '').toUpperCase();
}

function diffDate(date1: Date, date2: Date) {
  if (!(date1 && date2)) return -1;
  return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
}

export class EntryFormValidators {
  // Synchronous Validators
  static UANValidity() {
    return (control: FormControl) => {
      let uan: string = (control.value as string)?.toUpperCase();

      if (!uan) return null;

      return isUAN(uan) ? null : { notUAN: true };
    };
  }
}

function isUAN(uan: string): boolean {
  const UANRegEx = /^[A-Z]{2,3}\/[A-Z]{2,5}\/[\d]{5}$/;
  return UANRegEx.test(uan);
}
