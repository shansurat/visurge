import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  pairwise,
  take,
  takeUntil,
} from 'rxjs/operators';
import { _DisposeViewRepeaterStrategy } from '@angular/cdk/collections';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { clinicComments } from 'src/app/constants/clinicComments';
import { ClinicVisitEntry } from 'src/app/interfaces/clinic-visit-entry';
import { EditVlComponent } from 'src/app/modals/edit-vl/edit-vl.component';
import { EligibilityStatus } from 'src/app/interfaces/eligibility-status';
import { EntriesService } from 'src/app/services/entries.service';
import { FacilitiesService } from 'src/app/services/facilities.service';
import { getAge } from 'src/app/functions/getAge';
import { NewVlComponent } from 'src/app/modals/new-vl/new-vl.component';
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { regimens, regimensByGroup } from '../../constants/regimens';
import {
  slideInRightAnimation,
  slideInRightEnterAnimation,
  slideOutRightLeaveAnimation,
} from 'mdb-angular-ui-kit/animations';
import { StatusService } from 'src/app/services/status.service';
import { distinctUntilChangedObj } from 'src/app/functions/observable-functions';
import { UserUpdatedAlertComponent } from 'src/app/alerts/user-updated-alert/user-updated-alert.component';
import { ViewCvhComponent } from 'src/app/modals/view-cvh/view-cvh.component';
import { ViralLoadEntry } from 'src/app/interfaces/viral-load-entry';
import firebase from 'firebase/app';
import { timestampToDateForObj } from 'src/app/functions/timestampToDate';
import { SaveEntryComponent } from 'src/app/modals/save-entry/save-entry.component';
import { deepCopyObj } from 'src/app/functions/deepCopyObj';
import { AreYouSureComponent } from 'src/app/modals/are-you-sure/are-you-sure.component';
import { fields } from 'src/app/constants/entry-fields';
import { Facility } from 'src/app/interfaces/facility';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideInRightEnterAnimation(), slideOutRightLeaveAnimation()],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  ageUnits = ['year', 'month', 'day'];

  isLoading!: boolean;
  entriesAutocomplete$!: Observable<any[]>;

  isEntryNew: boolean = true;

  // Status
  eligibilityStatus!: EligibilityStatus | null;
  iit!: string | null;
  nextViralLoadSampleCollectionDate!: Date | null;
  entryDate!: Date | undefined;

  // Constants
  regimens = regimens;
  regimensByGroup = regimensByGroup;
  clinicComments = clinicComments;

  // Arrays
  vlh$ = new BehaviorSubject([] as ViralLoadEntry[]);
  cvh: ClinicVisitEntry[] = [];

  // FormControls
  uniqueARTNumberFormControl!: FormControl;
  facilityFormControl!: FormControl;
  entryFormGroup!: FormGroup;
  clinicVisitFormGroup!: FormGroup;
  birthdateKnownCheckboxFormControl = new FormControl();
  noViralLoadHasBeenDoneFormControl: FormControl = new FormControl();
  pendingStatusCheckboxFormControl: FormControl = new FormControl();
  phoneNumberCheckboxFormControl: FormControl = new FormControl();

  UAN$ = new BehaviorSubject('');

  today = new Date();

  loadedEntry$: BehaviorSubject<any> = new BehaviorSubject(null);
  canShowStatus = new BehaviorSubject(true);

  entryFormGroupError$: BehaviorSubject<any> = new BehaviorSubject(
    '' as string
  );
  clinicVisitFormGroupError$: BehaviorSubject<string> = new BehaviorSubject('');
  error$: BehaviorSubject<any> = new BehaviorSubject(null);

  miniDashboardShown!: boolean;

  diffDate = diffDate;
  activeFacility$ = new BehaviorSubject({} as Facility);

  constructor(
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalServ: MdbModalService,
    private notifServ: MdbNotificationService,
    private pushNotifServ: PushNotificationService,
    private statusServ: StatusService,
    public authServ: AuthService,
    public entriesServ: EntriesService,
    public facilitiesServ: FacilitiesService
  ) {
    this.today.setDate(new Date().getDate() + 1);
    this.facilityFormControl = new FormControl('', [Validators.required]);
    // Unique ART Number Form Control initialization
    this.uniqueARTNumberFormControl = new FormControl('', [
      Validators.required,
      Validators.maxLength(5),
      Validators.minLength(5),
    ]);

    // Entry Form Group initialization
    this.entryFormGroup = this.fb.group({
      ARTStartDate: ['', [Validators.required]],
      sex: ['', [Validators.required]],
      phoneNumber: [''],
      birthdate: [''],
      age: this.fb.group({
        age: ['', [Validators.required, Validators.min(0)]],
        unit: ['year', [Validators.required]],
      }),
      regimen: ['', [Validators.required]],
      regimenStartTransDate: ['', [Validators.required]],
      pmtct: ['', [Validators.required]],
      pmtctEnrollStartDate: [{ value: '', disabled: true }],
      hvl: ['', [Validators.required]],
      eac3Completed: [''],
      eac3CompletionDate: [{ value: '', disabled: true }],
      pendingStatusDate: [''],
    });

    this.authServ.isAdmin$.subscribe((isAdmin) => {
      isAdmin
        ? this.authServ.userData$.subscribe((userData) =>
            this.entryFormGroup.get('facility')?.setValue(userData.facility)
          )
        : this.entryFormGroup.get('facility')?.disable();
    });

    // Clinic Visit Form Group initialization
    this.clinicVisitFormGroup = this.fb.group({
      lastClinicVisitDate: [''],
      clinicVisitComment: ['', Validators.required],
      nextAppointmentDate: [''],
      facility: [''],
      dateTransferred: [''],
    });

    this.entriesAutocomplete$ = combineLatest(
      this.UAN$,
      this.entriesServ.all$,
      this.activeFacility$
    ).pipe(
      map(([UAN, all, facility]) => {
        return facility == undefined
          ? []
          : all.filter((entry) => {
              return entry.uniqueARTNumber.includes(
                UAN ? UAN : `${facility.state}/${facility.code}/`
              );
            });
      })
    );

    this.authServ.isAdmin$.subscribe((val) =>
      val
        ? this.facilityFormControl.enable()
        : this.facilityFormControl.disable()
    );
  }

  ngOnInit(): void {
    this.facilityFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        mergeMap((id: string) => {
          return this.facilitiesServ.getFacilityById(id);
        }),
        map((facility) => {
          this.uniqueARTNumberFormControl.reset();
          this.activeFacility$.next(facility);
        })
      )
      .subscribe();

    combineLatest(
      this.uniqueARTNumberFormControl.valueChanges.pipe(
        debounceTime(250),
        distinctUntilChanged()
      ),
      this.activeFacility$
    )
      .pipe(
        map(([num, facility]) =>
          this.UAN$.next(`${facility.state}/${facility.code}/${num}`)
        )
      )
      .subscribe();

    // Entries Autocomplete for UAN
    this.UAN$.pipe(
      mergeMap((UAN) => this.entriesServ.getEntry$(UAN))
    ).subscribe((entry) => this.loadedEntry$.next(entry));

    // Realtime Updating
    this.clinicVisitFormGroup
      .get('nextAppointmentDate')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((nextAppointmentDate) => {
        if (nextAppointmentDate)
          this.iit = this.statusServ.getIITStatus(nextAppointmentDate);
      });

    // Realtime updating Eligibility and Next Viral Load Sample Collection Date
    this.noViralLoadHasBeenDoneFormControl.valueChanges.subscribe(() =>
      this.updateEligibilityStatus()
    );

    // Birthdate listeners

    // Birthdate checkbox listener
    this.birthdateKnownCheckboxFormControl.valueChanges
      .pipe(
        map((birthdateKnown) => {
          if (birthdateKnown) this.ageUnitFormControl.disable();
          else {
            this.ageUnitFormControl.enable();
            this.entryFormGroup.get('birthdate')?.reset();
          }
        })
      )
      .subscribe();

    // Birthdate listener
    const bdListener$ = this.entryFormGroup.get('birthdate')?.valueChanges.pipe(
      distinctUntilChanged(),
      map((birthdate) => {
        if (birthdate) {
          const age = getAge(birthdate);
          if (age) {
            const unit = age.year ? 'year' : age.month ? 'month' : 'day';
            this.ageFormGroup.setValue({
              age: age[unit] || 0,
              unit,
            });
          }
        }
      })
    );
    let bdSubscription = bdListener$?.subscribe();

    // Realtime updating IIT Status

    // Viral Load Entries Listener
    const vlListener$ = this.vlh$.pipe(
      map((vlh) => {
        if (vlh.length) {
          if (!vlh[0].value || vlh[0].value < 1000) {
            this.entryFormGroup.get('hvl')?.setValue('no');
          } else this.entryFormGroup.get('hvl')?.setValue('yes');
        }
        this.updateEligibilityStatus();
      })
    );
    let vlSubscription = vlListener$.subscribe();

    //
    //
    // FORM LISTENERS START
    //
    //
    // Sex field listener
    const sexListener$ = this.sexFormControl.valueChanges.pipe(
      distinctUntilChanged(),
      map((sex: string) => {
        if (sex == 'male') {
          this.pmtctFormControl.setValue('no');
          this.pmtctFormControl.disable();
        } else {
          this.pmtctFormControl.enable();
          this.pmtctFormControl.reset();
        }
      })
    );
    let sexSubscription = sexListener$?.subscribe();

    // PMTCT field listener
    const pmtctListener$ = this.pmtctFormControl.valueChanges.pipe(
      distinctUntilChanged(),
      map((pmtct: string) => {
        if (pmtct == 'no') {
          this.pmtctDateFormControl.reset();
          this.pmtctDateFormControl.disable();
        } else {
          this.pmtctDateFormControl.enable();
        }
      })
    );
    let pmtctSubscription = pmtctListener$?.subscribe();

    // HVL field listener
    const hvlListener$ = this.hvlFormControl.valueChanges.pipe(
      distinctUntilChanged(),
      map((hvl) => {
        if (hvl == 'yes') {
          this.eac3FormControl.enable();
          this.noViralLoadHasBeenDoneFormControl.reset();
          this.noViralLoadHasBeenDoneFormControl.disable();
        } else {
          this.noViralLoadHasBeenDoneFormControl.enable();
          this.eac3FormControl.reset();
          this.eac3FormControl.disable();
        }
      })
    );
    let hvlSubscription = hvlListener$?.subscribe();

    // EAC-3 Completed field listener
    const eac3CompletedListener$ = this.eac3FormControl?.valueChanges.pipe(
      distinctUntilChanged(),
      map((eac3Completed) => {
        if (eac3Completed != 'yes') {
          this.eac3DateFormControl.reset();
          this.eac3DateFormControl.disable();
        } else this.eac3DateFormControl.enable();
      })
    );
    let eac3CompletedSubscription = eac3CompletedListener$?.subscribe();

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
    this.pendingStatusCheckboxFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        map((pendingStatus) => {
          if (!pendingStatus)
            this.entryFormGroup.get('pendingStatusDate')?.reset();
        })
      )
      .subscribe();

    // Phone Number Listener
    this.phoneNumberCheckboxFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        map((phoneNumber) => {
          if (!phoneNumber) this.entryFormGroup.get('phoneNumber')?.reset();
        })
      )
      .subscribe();
    //
    //
    // FORM LISTENERS END
    //
    //

    this.loadedEntry$.pipe(distinctUntilChangedObj()).subscribe((entry) => {
      // bdSubscription?.unsubscribe();
      this.isEntryNew = !entry;
      !!entry ? this.loadEntry(entry) : this.resetEntryForm();

      // bdSubscription = bdListener$?.subscribe();
    });

    // Error Checker

    combineLatest(
      this.entryFormGroup.valueChanges,
      this.vlh$,
      this.birthdateKnownCheckboxFormControl.valueChanges,
      this.phoneNumberCheckboxFormControl.valueChanges,
      this.pendingStatusCheckboxFormControl.valueChanges,
      this.noViralLoadHasBeenDoneFormControl.valueChanges
    )
      .pipe(
        map(([entry, vlh, bdCB, phoneCB, pendCB, nilCB]): string | null => {
          for (let [field, value] of Object.entries(entry)) {
            switch (field) {
              case 'ARTStartDate':
              case 'sex':
              case 'regimen':
              case 'regimenStartTransDate':
              case 'pmtct':
              case 'hvl':
                if (!value)
                  return `${
                    fields.find((f) => f.field == field)?.header
                  } is required.`;
                break;
              case 'pmtctEnrollStartDate':
                if (entry.pmtct == 'yes' && !value)
                  return `PMTCT Enrollment Start Date is required.`;
                break;
              case 'eac3Completed':
                if (entry.hvl == 'yes' && !value)
                  return `EAC-3 Completed is required.`;
                break;
              case 'eac3CompletionDate':
                if (entry.eac3Completed == 'yes' && !value)
                  return `EAC-3 Completion Date is required.`;
                break;
              case 'phoneNumber':
                if (phoneCB && !value) return `Phone Number is required.`;
                break;
              case 'pendingStatusDate':
                if (pendCB && !value) return `Pending Status Date is required.`;
            }
          }

          if (bdCB) {
            if (!entry.birthdate) return `Birthdate is required.`;
          } else {
            if (!entry.age.age) return `Age is required.`;
            ``;
            if (!entry.age.unit) return `Age unit is required.`;
          }

          if (!nilCB && !vlh.length)
            return `A viral load entry is required, otherwise check Nil.`;

          return null;
        })
      )
      .subscribe((entryFormGroupError) =>
        this.entryFormGroupError$.next(entryFormGroupError)
      );

    combineLatest(
      this.uniqueARTNumberFormControl.statusChanges.pipe(
        distinctUntilChanged(),
        map((isValidUAN) => isValidUAN == 'VALID')
      ),
      this.entryFormGroupError$,
      this.clinicVisitFormGroupError$
    )
      .pipe(
        map(([isValidUAN, entryFormGroupError, clinicVisitFormGroupError]) => {
          if (!isValidUAN) return 'Unique ART Number is invalid.';
          else if (entryFormGroupError) return entryFormGroupError;
          else if (clinicVisitFormGroupError) return clinicVisitFormGroupError;
          return null;
        })
      )
      .subscribe((err: string | null) => this.error$.next(err));

    // Setting the UAN param
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.afs
        .collection('entries')
        .doc(id)
        .get()
        .subscribe((doc) => {
          const { facility, uniqueARTNumber } = doc.data() as any;
          this.facilityFormControl.setValue(facility);
          this.uniqueARTNumberFormControl.setValue(
            uniqueARTNumber.split('/')[2]
          );
        });
    } else {
      this.authServ.currentFacility$
        .pipe(filter((fac) => fac != null))
        .subscribe((fac: Facility) => {
          this.facilityFormControl.setValue(fac.uid);
        });
    }

    this.isLoading = false;
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  loadEntry(entry: any) {
    let {
      entryDate,
      pmtctEnrollStartDate,
      ARTStartDate,
      regimenStartTransDate,
      eac3CompletionDate,
      birthdate,
      nextViralLoadSampleCollectionDate,
      pendingStatusDate,
      age,
      vlh,
      cvh,
      ...data
    } = entry;

    this.entryDate = entryDate?.toDate();
    this.entryFormGroup.reset({
      pmtctEnrollStartDate: pmtctEnrollStartDate?.toDate(),
      ARTStartDate: ARTStartDate?.toDate(),
      regimenStartTransDate: regimenStartTransDate?.toDate(),
      eac3CompletionDate: eac3CompletionDate?.toDate(),
      birthdate: birthdate?.toDate(),
      nextViralLoadSampleCollectionDate:
        nextViralLoadSampleCollectionDate?.toDate(),
      pendingStatusDate: pendingStatusDate?.toDate(),
      ...data,
    });

    if (birthdate) {
      this.entryFormGroup.get('birthdate')?.setValue(birthdate.toDate());
      const age = getAge(entry.birthdate.toDate());
      if (age) {
        const unit = age.year ? 'year' : age.month ? 'month' : 'day';
        this.ageFormGroup.setValue({
          age: age[unit] || 0,
          unit,
        });
      }
    } else this.ageFormGroup.patchValue(age);

    // Converting all Timestamp objects in CVH to Date objects
    const _cvh = (cvh as ClinicVisitEntry[])
      ?.map((cv) => {
        const _cv = timestampToDateForObj(cv);
        delete _cv.iitStatus;
        return _cv;
      })
      ?.sort(
        (a: any, b: any) =>
          b.nextAppointmentDate?.getTime() - a.nextAppointmentDate?.getTime()
      );

    this.cvh = _cvh;

    this.clinicVisitFormGroup.reset(cvh[cvh.length - 1]);

    // Setting Viral Load Entries
    this.noViralLoadHasBeenDoneFormControl.setValue(!vlh.length);
    if (vlh.length) this.noViralLoadHasBeenDoneFormControl.disable();

    const _vlh = (vlh as any[]).map((vl) => timestampToDateForObj(vl));
    this.vlh$.next(_vlh);

    // Setting checkboxes
    this.pendingStatusCheckboxFormControl.setValue(entry.pendingStatusDate);
    this.birthdateKnownCheckboxFormControl.setValue(entry.birthdate);
    this.phoneNumberCheckboxFormControl.setValue(entry.phoneNumber);
  }

  get ageFormGroup(): FormGroup {
    return this.entryFormGroup.get('age') as FormGroup;
  }

  get ageFormControl(): FormControl {
    return this.ageFormGroup.get('age') as FormControl;
  }

  get ageUnitFormControl(): FormControl {
    return this.ageFormGroup.get('unit') as FormControl;
  }

  get sexFormControl(): FormControl {
    return this.entryFormGroup.get('sex') as FormControl;
  }

  get pmtctFormControl(): FormControl {
    return this.entryFormGroup.get('pmtct') as FormControl;
  }
  get pmtctDateFormControl(): FormControl {
    return this.entryFormGroup.get('pmtctEnrollStartDate') as FormControl;
  }

  get hvlFormControl(): FormControl {
    return this.entryFormGroup.get('hvl') as FormControl;
  }

  get eac3FormControl(): FormControl {
    return this.entryFormGroup.get('eac3Completed') as FormControl;
  }

  get eac3DateFormControl(): FormControl {
    return this.entryFormGroup.get('eac3CompletionDate') as FormControl;
  }

  updateEligibilityStatus() {
    this.eligibilityStatus = this.statusServ.getEligibilityStatus({
      entryDate: this.entryDate,
      ...this.entryFormGroup.getRawValue(),
      vlh: this.vlh$.getValue(),
    });

    this.nextViralLoadSampleCollectionDate = this.statusServ.getNextVLDate({
      ...this.entryFormGroup.getRawValue(),
      vlh: this.vlh$.getValue(),
    });
  }

  updateIITStatus() {
    this.iit = this.statusServ.getIITStatus(
      this.clinicVisitFormGroup.get('nextAppointmentDate')?.value as Date
    );
  }

  strToInt(text: string) {
    return parseInt(text);
  }

  resetEntryForm() {
    this.entryDate = undefined;
    this.entryFormGroup.reset();
    this.pendingStatusCheckboxFormControl.reset();
    this.birthdateKnownCheckboxFormControl.reset();
    this.phoneNumberCheckboxFormControl.reset();
    this.ageFormGroup.reset();
    this.clinicVisitFormGroup.reset();
    this.cvh = [];
    this.vlh$.next([]);
    this.nextViralLoadSampleCollectionDate = null;
  }

  saveEntryForm() {
    const UAN = this.UAN$.getValue();

    const saveEntryModalRef = this.modalServ.open(SaveEntryComponent, {
      modalClass: 'modal-dialog-centered',
      data: {
        UAN,
      },
    });

    saveEntryModalRef.onClose.subscribe((save: boolean) => {
      if (save) {
        this.isLoading = true;

        const id = this.isEntryNew
          ? this.afs.collection('entries').doc().ref.id
          : this.loadedEntry$.getValue().id;
        const facility = this.authServ.currentFacility$.getValue().code;
        const _entryVal = this.entryFormGroup.getRawValue();
        let _data = {
          facility,
          ..._entryVal,
          vlh: this.vlh$.getValue(),
          eligibility: this.eligibilityStatus,
          iit: this.iit,
          nextViralLoadSampleCollectionDate:
            this.nextViralLoadSampleCollectionDate,
        };

        let data = this.isEntryNew
          ? {
              id,
              ..._data,
              uniqueARTNumber: UAN,
              entryDate: firebase.firestore.FieldValue.serverTimestamp(),
            }
          : _data;

        Object.keys(data).forEach((key) => {
          if (data[key] == undefined) data[key] = null;
        });

        let entryRef = this.afs.collection('entries').doc(id);

        entryRef.set(data, { merge: true }).then(() => {
          this.notifServ.open(UserUpdatedAlertComponent, {
            data: { uniqueARTNumber: UAN },
            autohide: true,
          });

          this.uniqueARTNumberFormControl.reset();
          this.isLoading = false;
        });

        this.saveClinicVisitForm();
      }
    });
  }

  saveClinicVisitForm() {
    this.isLoading = true;
    const UAN = this.UAN$.getValue();
    const id = this.isEntryNew ? UANToId(UAN) : this.loadedEntry$.getValue().id;

    this.afs
      .collection('entries')
      .doc(id)
      .set(
        {
          cvh: firebase.firestore.FieldValue.arrayUnion(
            this.clinicVisitFormGroup.value
          ),
        },
        { merge: true }
      )
      .then((res) => {
        if (
          this.clinicVisitFormGroup
            .get('clinicVisitComment')
            ?.value?.includes('Transfer')
        ) {
          this.pushNotifServ.addPushNotif({
            message: `${UAN} ${
              this.clinicVisitFormGroup.get('clinicVisitComment')?.value
            } ${
              this.clinicVisitFormGroup.get('facility')?.value
            }`.toUpperCase(),
            unread: true,
            dateCreated: new Date(),
          });
        }
        this.isLoading = false;
      });
  }

  // Viral Load Functions
  openNewVLModal() {
    let newVLModalRef = this.modalServ.open(NewVlComponent, {
      modalClass: 'modal-dialog-centered modal-sm',
    });

    newVLModalRef.onClose.subscribe((vlEntry) => {
      if (vlEntry) {
        this.vlh$.next(this.sortVLH([...this.vlh$.getValue(), vlEntry]));
        this.noViralLoadHasBeenDoneFormControl.reset();
        this.noViralLoadHasBeenDoneFormControl.disable();
      }
    });
  }

  openEditVLModal(i: number) {
    let editVLModalRef = this.modalServ.open(EditVlComponent, {
      modalClass: 'modal-dialog-centered modal-sm',
      data: { vl: this.vlh$.getValue()[i] },
    });

    editVLModalRef.onClose.subscribe((vlEntry) => {
      if (vlEntry) {
        const vlh = this.vlh$.getValue();
        vlh[i] = vlEntry;
        this.vlh$.next(this.sortVLH(vlh));
      }
    });
  }

  removeVL(i: number) {
    const areYouSureModalRef = this.modalServ.open(AreYouSureComponent, {
      modalClass: 'modal-dialog-centered',
      data: { title: 'Delete Viral Load Entry', context: `#${i + 1}` },
      ignoreBackdropClick: true,
      keyboard: false,
    });

    areYouSureModalRef.onClose.subscribe((yes) => {
      if (yes) {
        const vlh = this.vlh$.getValue();
        vlh.splice(i, 1);
        if (vlh.length) this.noViralLoadHasBeenDoneFormControl.enable();
        this.vlh$.next(vlh);
      }
    });
  }

  sortVLH(vlh: ViralLoadEntry[]) {
    return vlh.sort(
      (x, y) =>
        y.dateSampleCollected.valueOf() - x.dateSampleCollected.valueOf()
    );
  }

  // Clinic Visit Functions
  viewCVH() {
    this.modalServ.open(ViewCvhComponent, {
      data: {
        cvh: this.cvh,
        cv: this.clinicVisitFormGroup.value,
        isNewCV: this.clinicVisitFormGroup.pristine,
      },
      modalClass:
        'modal-dialog-centered modal-lg modal-fullscreen-md-down modal-dialog-scrollable',
    });
  }
}

function UANToId(UAN: string) {
  return UAN.replace(/\//g, '').toUpperCase();
}

function diffDate(date1: Date | null, date2: Date | null) {
  if (!(date1 && date2)) return -1;
  return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
}

function isUAN(uan: string): boolean {
  const UANRegEx = /^[A-Z]{2,3}\/[A-Z]{2,5}\/[\d]{5}$/;
  return UANRegEx.test(uan);
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
