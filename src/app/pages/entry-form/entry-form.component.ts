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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbStepperOrientation } from 'mdb-angular-ui-kit/stepper';
import { Subscription, timer } from 'rxjs';
import { fromEvent, Observable, combineLatest } from 'rxjs';
import {
  combineAll,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  share,
} from 'rxjs/operators';
import { UserLoadedAlertComponent } from 'src/app/alerts/user-loaded-alert/user-loaded-alert.component';
import { UserEntry } from 'src/app/interfaces/user-entry';
import { ViralLoadEntry } from 'src/app/interfaces/viral-load-entry';
import { EditVlComponent } from 'src/app/modals/edit-vl/edit-vl.component';
import { NewVlComponent } from 'src/app/modals/new-vl/new-vl.component';
import { regimens } from '../../constants/regimens';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EntryFormComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  time = new Date();
  rxTime = new Date();
  intervalId!: any;
  timeSubscription!: Subscription;

  eligibility!: string;
  iit!: string;

  regimenOptions = [
    { value: 'TLD', label: 'TLD' },
    { value: 'TLE', label: 'TLE' },
    { value: 'Others', label: 'Others' },
  ];

  regimens = regimens;
  regimensByGroup: any[] = [];

  ageCategories = [
    '1st Line Adult',
    '2nd Line Adult',
    '1st Line Children',
    '2nd Line Children',
  ];

  commentOptions = [
    'Transfer Out',
    'Transfer In',
    'Dead',
    'Lost-To-Follow-Up (IIT)',
    'Nil',
  ];

  vlh: ViralLoadEntry[] = [];

  entryFormGroup!: FormGroup;
  uniqueARTNumberFormControl!: FormControl;

  group1!: FormGroup;

  biodataFormGroup!: FormGroup;
  maxBirthdate = new Date();

  verBP = 992;
  orientation: MdbStepperOrientation = 'horizontal';

  constructor(
    private cdref: ChangeDetectorRef,
    private fb: FormBuilder,
    private modalServ: MdbModalService,
    private afs: AngularFirestore,
    private notifServ: MdbNotificationService
  ) {
    this.ageCategories.forEach((ageCategory) => {
      this.regimensByGroup.push({
        name: ageCategory,
        regimens: regimens.filter(
          (regimen) => regimen.ageCategory == ageCategory
        ),
      });
    });
  }

  ngOnInit(): void {
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

    this.entryFormGroup = this.fb.group({
      sex: ['', [Validators.required]],
      birthdate: ['', Validators.required],
      ARTStartDate: ['', [Validators.required]],
      regimen: ['', [Validators.required]],
      regimenStartTransDate: ['', [Validators.required]],
      pmtct: ['', [Validators.required]],
      pmtctEnrollStartDate: '',
      hvl: ['', [Validators.required]],
      eac3Completed: [''],
      eac3CompletionDate: '',
      lastClinicVisitDate: '',
      clinicVisitComment: '',
      nextAppointmentDate: '',
    });

    this.uniqueARTNumberFormControl = new FormControl('', [
      Validators.required,
    ]);

    this.uniqueARTNumberFormControl.valueChanges.subscribe(
      (uniqueArtNumber) => {
        console.log(uniqueArtNumber);
        if (uniqueArtNumber) {
          this.entryFormGroup.enable();
        } else {
          this.entryFormGroup.disable();
        }
      }
    );

    this.uniqueARTNumberFormControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        mergeMap((uniqueARTNumber) => {
          return this.afs.collection('entries').doc(uniqueARTNumber).get();
        }),
        map((entry) => {
          return entry.exists ? entry.data() : null;
        })
      )
      .subscribe((res: UserEntry | any) => {
        if (res) {
          console.log();
          let { vlh, uniqueARTNumber } = res;

          delete res.uniqueARTNumber;
          delete res.vlh;

          res.ARTStartDate = res.ARTStartDate.toDate();
          res.birthdate = res.birthdate.toDate();
          res.regimenStartTransDate = res.regimenStartTransDate.toDate();
          res.eac3CompletionDate = res.eac3CompletionDate.toDate();
          res.lastClinicVisitDate = res.lastClinicVisitDate.toDate();
          res.nextAppointmentDate = res.nextAppointmentDate.toDate();

          this.entryFormGroup.setValue(res);
          this.notifServ.open(UserLoadedAlertComponent, {
            autohide: true,
            data: { uniqueARTNumber },
          });

          this.entryFormGroup.get('regimen')?.setValue(res.regimen);
        } else {
          this.entryFormGroup.reset();
          this.vlh = [];
        }
      });

    // this.entryFormGroup.valueChanges.subscribe((val) => {
    //   setEligibilityStatus({
    //     ...val,
    //     vlh: this.vlh,
    //   });

    //   this.iit = getIITStatus({
    //     ...val,
    //     vlh: this.vlh,
    //   });
    // });

    this.entryFormGroup.get('pmtct')?.valueChanges.subscribe((val) => {
      if (!val) this.entryFormGroup.get('pmtctEnrollStartDate')?.setValue('');
    });
    this.entryFormGroup.get('hvl')?.valueChanges.subscribe((val) => {
      if (!val) this.entryFormGroup.get('eac3Completed')?.setValue('');
    });
    this.entryFormGroup.get('eac3Completed')?.valueChanges.subscribe((val) => {
      if (val) this.entryFormGroup.get('eac3CompletionDate')?.setValue('');
    });

    fromEvent(window, 'resize').subscribe((event: any) => {
      event.target.innerWidth <= this.verBP
        ? (this.orientation = 'vertical')
        : (this.orientation = 'horizontal');
    });
    this.orientation =
      window.innerWidth <= this.verBP ? 'vertical' : 'horizontal';
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
    let uniqueARTNumber = this.uniqueARTNumberFormControl.value;
    console.log('Saving information!');
    console.log(this.entryFormGroup.value);
    this.afs
      .collection('entries')
      .doc(uniqueARTNumber)
      .set(
        { ...this.entryFormGroup.value, vlh: this.vlh, uniqueARTNumber },
        { merge: true }
      );
  }

  openNewVLModal() {
    let newVLModalRef = this.modalServ.open(NewVlComponent, {
      modalClass: 'modal-dialog-centered',
    });

    newVLModalRef.onClose.subscribe((vlEntry) => {
      if (vlEntry) {
        this.vlh.push(vlEntry);
        this.sortVLH();
      }
    });
  }

  openEditVLModal(i: number) {
    let editVLModalRef = this.modalServ.open(EditVlComponent, {
      modalClass: 'modal-dialog-centered',
      data: this.vlh[i],
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
  }

  sortVLH() {
    this.vlh.sort(
      (x, y) =>
        y.dateSampleCollected.valueOf() - x.dateSampleCollected.valueOf()
    );
  }
}

function diffDate(date1: Date, date2: Date) {
  return (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24);
}

function setEligibilityStatus(formVal: any): string {
  let {
    sex,
    birthdate,
    currentAge,
    ageContext,
    uniqueARTNumber,
    ARTStartDate,
    regimen,
    regimenStartTransDate,
    pmtct,
    pmtctEnrollStartDate,
    hvl,
    eac3Completed,
    eac3CompletionDate,
    lastClinicVisitDate,
    clinicVisitComment,
    nextAppointmentDate,
    vlh,
  }: {
    facilityName: string;
    sex: string;
    birthdate?: Date;
    currentAge?: number;
    ageContext?: string;
    uniqueARTNumber: string;
    ARTStartDate: Date;
    regimen: any;
    regimenStartTransDate: Date;
    pmtct: boolean;
    pmtctEnrollStartDate: Date;
    hvl: boolean;
    eac3Completed?: boolean;
    eac3CompletionDate: Date;
    lastClinicVisitDate?: Date;
    clinicVisitComment?: string;
    nextAppointmentDate?: Date;
    vlh: ViralLoadEntry[];
  } = formVal;

  let today = new Date();

  // Initializing Date Differences
  let ARTStartDateDiff = diffDate(today, ARTStartDate);

  let regStartDateDiff = diffDate(today, regimenStartTransDate);
  let regStartDateDiffARTStartDate = diffDate(
    regimenStartTransDate,
    ARTStartDate
  );

  let pmtctStartDateDiffRegStartDate = pmtct
    ? diffDate(pmtctEnrollStartDate, regimenStartTransDate)
    : -1;
  let pmtctStartDateDiffARTStartDate = pmtct
    ? diffDate(pmtctEnrollStartDate, ARTStartDate)
    : -1;

  if (pmtct) {
    if (
      pmtctStartDateDiffARTStartDate > 0 &&
      pmtctStartDateDiffRegStartDate > 0
    ) {
      if (hvl) {
        if (eac3Completed) {
          if (vlh.length && vlh[0].value > 1000) {
            return 'eligible';
          }
        } else {
          if (vlh.length && vlh[0].value > 1000) {
            return 'ineligible-complete-eac';
          }
        }
      } else {
        if (vlh.length) {
          if (vlh[0].value < 1000)
            if (
              (vlh.length == 1 &&
                diffDate(pmtctEnrollStartDate, vlh[0].dateSampleCollected) <
                  0) ||
              diffDate(pmtctEnrollStartDate, vlh[0].dateSampleCollected) >= 180
            ) {
              return 'eligible';
            } else if (
              vlh.length == 2 &&
              diffDate(
                vlh[0].dateSampleCollected,
                vlh[1].dateSampleCollected
              ) >= 180 &&
              diffDate(pmtctEnrollStartDate, vlh[1].dateSampleCollected) >=
                180 &&
              vlh[1].value < 1000
            ) {
              return 'eligible';
            } else if (
              vlh.length == 3 &&
              diffDate(
                vlh[0].dateSampleCollected,
                vlh[1].dateSampleCollected
              ) >= 180 &&
              diffDate(
                vlh[1].dateSampleCollected,
                vlh[2].dateSampleCollected
              ) >= 180 &&
              diffDate(pmtctEnrollStartDate, vlh[2].dateSampleCollected) >=
                180 &&
              vlh[1].value < 1000 &&
              vlh[2].value < 1000
            ) {
              return 'eligible';
            } else if (
              vlh.length >= 4 &&
              diffDate(
                vlh[0].dateSampleCollected,
                vlh[1].dateSampleCollected
              ) >= 180 &&
              diffDate(
                vlh[1].dateSampleCollected,
                vlh[2].dateSampleCollected
              ) >= 180 &&
              diffDate(
                vlh[2].dateSampleCollected,
                vlh[3].dateSampleCollected
              ) >= 180 &&
              diffDate(pmtctEnrollStartDate, vlh[3].dateSampleCollected) >=
                180 &&
              vlh[1].value < 1000 &&
              vlh[2].value < 1000 &&
              vlh[3].value < 1000
            ) {
              return 'eligible';
            }
        }
        return 'eligible';
      }
    } else if (
      ARTStartDate == regimenStartTransDate &&
      ARTStartDate == pmtctEnrollStartDate
    ) {
      if (ARTStartDateDiff >= 90 && !hvl && !vlh.length) return 'eligible';
      else {
        if (hvl) {
          if (eac3Completed) {
            if (vlh.length) {
              if (
                diffDate(vlh[1].dateSampleCollected, eac3CompletionDate) >=
                  90 &&
                diffDate(pmtctEnrollStartDate, vlh[1].dateSampleCollected) >=
                  90 &&
                vlh[1].value >= 1000
              ) {
                return 'eligible';
              }
            }
          } else {
            if (
              vlh.length &&
              diffDate(pmtctEnrollStartDate, vlh[1].dateSampleCollected) >=
                90 &&
              vlh[1].value >= 1000
            )
              return 'ineligible-complete-eac';
          }
        } else {
          if (
            vlh.length == 1 &&
            diffDate(pmtctEnrollStartDate, vlh[0].dateSampleCollected) >= 90 &&
            vlh[0].value < 1000
          ) {
            return 'eligible';
          } else if (
            vlh.length == 2 &&
            diffDate(vlh[0].dateSampleCollected, vlh[1].dateSampleCollected) >=
              180 &&
            vlh[0].value < 1000 &&
            diffDate(pmtctEnrollStartDate, vlh[1].dateSampleCollected) >= 90
          ) {
            return 'eligible';
          } else if (
            vlh.length == 3 &&
            diffDate(vlh[0].dateSampleCollected, vlh[1].dateSampleCollected) >=
              180 &&
            vlh[0].value < 1000 &&
            diffDate(vlh[1].dateSampleCollected, vlh[2].dateSampleCollected) >=
              180 &&
            diffDate(pmtctEnrollStartDate, vlh[2].dateSampleCollected) >= 90
          ) {
            return 'eligible';
          } else if (
            vlh.length >= 4 &&
            diffDate(vlh[0].dateSampleCollected, vlh[1].dateSampleCollected) >=
              180 &&
            vlh[0].value < 1000 &&
            diffDate(vlh[1].dateSampleCollected, vlh[2].dateSampleCollected) >=
              180 &&
            diffDate(vlh[2].dateSampleCollected, vlh[3].dateSampleCollected) >=
              180 &&
            diffDate(vlh[3].dateSampleCollected, pmtctEnrollStartDate) >= 90
          ) {
            return 'eligible';
          }
        }
      }
    }
  } else {
    if (
      ARTStartDateDiff < 180 &&
      regStartDateDiff < 180 &&
      !hvl &&
      !vlh.length
    ) {
      return 'ineligible';
    } else {
      if (regimen.category == 'tld') {
        if (hvl) {
          if (eac3Completed) {
            if (
              vlh.length &&
              diffDate(eac3CompletionDate, vlh[0].dateSampleCollected) >= 180 &&
              vlh[0].value >= 1000
            ) {
              if (
                vlh.length == 1 &&
                diffDate(vlh[0].dateSampleCollected, regimenStartTransDate) >=
                  180
              ) {
                return 'eligible';
              } else if (
                vlh.length == 2 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[1].dateSampleCollected, regimenStartTransDate) >=
                  180 &&
                vlh[1].value < 1000
              ) {
                return 'eligible';
              } else if (
                vlh.length == 3 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 180 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[2].dateSampleCollected, regimenStartTransDate) >=
                  180 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000
              ) {
                return 'eligible';
              } else if (
                vlh.length >= 4 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 180 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 180 &&
                diffDate(
                  vlh[2].dateSampleCollected,
                  vlh[3].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[3].dateSampleCollected, regimenStartTransDate) >=
                  180 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000 &&
                vlh[3].value < 1000
              ) {
                return 'eligible';
              }
            }
          } else if (vlh.length && vlh[0].value >= 1000) {
            if (
              vlh.length == 1 &&
              diffDate(vlh[0].dateSampleCollected, regimenStartTransDate)
            ) {
              return 'ineligible-complete-eac';
            } else if (
              vlh.length == 2 &&
              diffDate(
                vlh[0].dateSampleCollected,
                vlh[1].dateSampleCollected
              ) >= 180 &&
              diffDate(vlh[1].dateSampleCollected, regimenStartTransDate) >=
                180 &&
              vlh[1].value < 1000
            ) {
              return 'ineligible-complete-eac';
            } else if (
              vlh.length == 3 &&
              diffDate(
                vlh[0].dateSampleCollected,
                vlh[1].dateSampleCollected
              ) >= 180 &&
              diffDate(
                vlh[1].dateSampleCollected,
                vlh[2].dateSampleCollected
              ) >= 180 &&
              diffDate(vlh[2].dateSampleCollected, regimenStartTransDate) >=
                180 &&
              vlh[1].value < 1000 &&
              vlh[2].value < 1000
            ) {
              return 'ineligible-complete-eac';
            } else if (
              vlh.length >= 4 &&
              diffDate(
                vlh[0].dateSampleCollected,
                vlh[1].dateSampleCollected
              ) >= 180 &&
              diffDate(
                vlh[1].dateSampleCollected,
                vlh[2].dateSampleCollected
              ) >= 180 &&
              diffDate(
                vlh[2].dateSampleCollected,
                vlh[3].dateSampleCollected
              ) >= 180 &&
              diffDate(vlh[3].dateSampleCollected, regimenStartTransDate) >=
                180 &&
              vlh[1].value < 1000 &&
              vlh[2].value < 1000 &&
              vlh[3].value < 1000
            ) {
              return 'ineligible-complete-eac';
            }
          }
        } else {
          if (!vlh.length) return 'eligible';
          else if (
            vlh.length == 1 &&
            diffDate(vlh[0].dateSampleCollected, regimenStartTransDate) >=
              180 &&
            vlh[0].value < 1000
          ) {
            return 'eligible';
          } else if (
            vlh.length == 2 &&
            diffDate(vlh[0].dateSampleCollected, vlh[1].dateSampleCollected) >=
              180 &&
            diffDate(vlh[0].dateSampleCollected, regimenStartTransDate) >=
              360 &&
            diffDate(vlh[1].dateSampleCollected, regimenStartTransDate) >=
              180 &&
            vlh[0].value < 1000 &&
            vlh[1].value < 1000
          ) {
            return 'eligible-12-months';
          } else if (
            vlh.length == 3 &&
            diffDate(vlh[0].dateSampleCollected, vlh[1].dateSampleCollected) >=
              360 &&
            diffDate(vlh[0].dateSampleCollected, regimenStartTransDate) >=
              720 &&
            diffDate(vlh[1].dateSampleCollected, vlh[2].dateSampleCollected) >=
              180 &&
            diffDate(vlh[1].dateSampleCollected, regimenStartTransDate) >=
              360 &&
            diffDate(vlh[2].dateSampleCollected, regimenStartTransDate) >=
              180 &&
            vlh[0].value < 1000 &&
            vlh[1].value < 1000 &&
            vlh[2].value < 1000
          ) {
            return 'eligible-12-months';
          } else if (
            vlh.length >= 4 &&
            diffDate(vlh[0].dateSampleCollected, vlh[1].dateSampleCollected) >=
              360 &&
            diffDate(vlh[0].dateSampleCollected, regimenStartTransDate) >=
              1080 &&
            diffDate(vlh[1].dateSampleCollected, vlh[2].dateSampleCollected) >=
              360 &&
            diffDate(vlh[2].dateSampleCollected, regimenStartTransDate) >=
              720 &&
            diffDate(vlh[2].dateSampleCollected, vlh[3].dateSampleCollected) >=
              180 &&
            diffDate(vlh[2].dateSampleCollected, regimenStartTransDate) >=
              360 &&
            diffDate(vlh[3].dateSampleCollected, regimenStartTransDate) >=
              180 &&
            vlh[0].value < 1000 &&
            vlh[1].value < 1000 &&
            vlh[2].value < 1000 &&
            vlh[3].value < 1000
          ) {
            return 'eligible-12-months';
          }
        }
      } else {
        if (diffDate(ARTStartDate, regimenStartTransDate) >= 180) {
          if (hvl) {
            if (eac3Completed && vlh.length && vlh[0].value >= 1000) {
              if (
                vlh.length == 1 &&
                diffDate(vlh[0].dateSampleCollected, ARTStartDate) >= 180
              )
                return 'eligible';
              else if (
                vlh.length >= 2 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[1].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[1].value < 1000
              )
                return 'eligible';
            } else {
              if (
                vlh.length == 1 &&
                diffDate(vlh[0].dateSampleCollected, ARTStartDate) >= 180
              )
                return 'ineligible-complete-eac';
              else if (
                vlh.length >= 2 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[1].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[1].value < 1000
              )
                return 'ineligible-complete-eac';
            }
          } else {
            if (!vlh.length) return 'eligible';
            else if (
              vlh.length == 1 &&
              diffDate(vlh[0].dateSampleCollected, ARTStartDate) >= 180 &&
              vlh[0].value < 1000
            )
              return 'eligible';
            else if (
              vlh.length >= 2 &&
              diffDate(
                vlh[0].dateSampleCollected,
                vlh[1].dateSampleCollected
              ) >= 180 &&
              diffDate(vlh[1].dateSampleCollected, ARTStartDate) >= 180 &&
              vlh[0].value < 1000 &&
              vlh[1].value < 1000
            )
              return 'eligible-12-months';
          }
        } else if (regStartDateDiff >= 180) {
          if (hvl) {
            if (eac3Completed && vlh.length && vlh[0].value >= 1000) {
              if (
                vlh.length == 3 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[2].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000
              ) {
                return 'eligible';
              } else if (
                vlh.length == 4 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 180 &&
                diffDate(
                  vlh[2].dateSampleCollected,
                  vlh[3].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[3].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000 &&
                vlh[3].value < 1000
              ) {
                return 'eligible';
              }
            } else if (vlh.length && vlh[0].value >= 1000) {
              if (
                vlh.length == 3 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[2].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000
              ) {
                return 'ineligible-incomplete-eac';
              } else if (
                vlh.length == 4 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 180 &&
                diffDate(
                  vlh[2].dateSampleCollected,
                  vlh[3].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[3].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000 &&
                vlh[3].value < 1000
              ) {
                return 'ineligible-incomplete-eac';
              }
            }
          } else {
            if (vlh.length && vlh[0].value < 1000) {
              if (
                vlh.length == 3 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[2].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[0].value < 1000 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000
              ) {
                return 'eligible-12-months';
              } else if (
                vlh.length >= 4 &&
                diffDate(
                  vlh[0].dateSampleCollected,
                  vlh[1].dateSampleCollected
                ) >= 360 &&
                diffDate(
                  vlh[1].dateSampleCollected,
                  vlh[2].dateSampleCollected
                ) >= 380 &&
                diffDate(
                  vlh[2].dateSampleCollected,
                  vlh[3].dateSampleCollected
                ) >= 180 &&
                diffDate(vlh[3].dateSampleCollected, ARTStartDate) >= 180 &&
                vlh[0].value < 1000 &&
                vlh[1].value < 1000 &&
                vlh[2].value < 1000 &&
                vlh[3].value < 1000
              ) {
                return 'eligible-12-months';
              }
            }
          }
        }
      }
    }
  }

  return 'ineligible';
}

function getIITStatus(formVal: any): string {
  return '';
}
