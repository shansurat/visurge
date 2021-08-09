import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { IITStatus } from 'src/app/constants/IITStatus';
import { regimensByGroup } from 'src/app/constants/regimens';
import { distinctUntilChangedObj } from 'src/app/functions/observable-functions';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'database-advanced-filters',
  templateUrl: './advanced-filters.component.html',
  styleUrls: ['./advanced-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdvancedFiltersComponent implements OnInit {
  @Input() currentAdvancedFilters: any;
  @Output() advancedFiltersUpdated = new EventEmitter();

  IITStatus = IITStatus;

  advancedFilterFormGroup!: FormGroup;
  regimensByGroup = regimensByGroup;

  // Checkboxes
  entryDateCB = new FormControl(false);
  ARTDateCB = new FormControl(false);
  regDateCB = new FormControl(false);
  pmtctDateCB = new FormControl(false);
  pendDateCB = new FormControl(false);
  eac3DateCB = new FormControl(false);
  facilityCB = new FormControl(false);
  UANCB = new FormControl(false);
  sexCB = new FormControl(false);
  pmtctCB = new FormControl(false);
  HVLCB = new FormControl(false);
  eac3CB = new FormControl(false);
  pendCB = new FormControl(false);
  eligibleCB = new FormControl(false);
  phoneCB = new FormControl(false);
  regimenCB = new FormControl(false);
  iitCB = new FormControl(false);

  constructor(
    private fb: FormBuilder,
    public facilitiesServ: FacilitiesService
  ) {
    this.advancedFilterFormGroup = fb.group({
      entryDate: this.fb.group({
        from: [''],
        to: [''],
      }),
      ARTStartDate: this.fb.group({
        from: [''],
        to: [''],
      }),
      regimenStartTransDate: this.fb.group({
        from: [''],
        to: [''],
      }),
      pmtctEnrollStartDate: this.fb.group({
        from: [''],
        to: [''],
      }),
      pendingStatusDate: this.fb.group({
        from: [''],
        to: [''],
      }),
      eac3CompletionDate: this.fb.group({
        from: [''],
        to: [''],
      }),

      facility: [''],
      uniqueARTNumber: [''],
      sex: [''],
      pmtct: [''],
      hvl: [''],
      eac3Completed: [''],
      pendingStatus: [''],
      eligible: [''],
      phoneNumber: [''],
      regimen: [''],
      iit: [''],
    });
  }

  ngOnInit(): void {
    this.advancedFilterFormGroup.valueChanges
      .pipe(distinctUntilChangedObj())
      .subscribe((val) => {
        this.advancedFiltersUpdated.emit(val);
      });

    this.entryDateCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val) this.advancedFilterFormGroup.get('entryDate')?.reset();
      });

    this.ARTDateCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val) this.advancedFilterFormGroup.get('ARTStartDate')?.reset();
      });

    this.regDateCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val)
          this.advancedFilterFormGroup.get('regimenStartTransDate')?.reset();
      });

    this.pmtctDateCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val)
          this.advancedFilterFormGroup.get('pmtctEnrollStartDate')?.reset();
      });

    this.pendDateCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val)
          this.advancedFilterFormGroup.get('pendingStatusDate')?.reset();
      });

    this.facilityCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val) this.advancedFilterFormGroup.get('facility')?.reset();
      });

    this.eac3DateCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val)
          this.advancedFilterFormGroup.get('eac3CompletionDate')?.reset();
      });

    this.UANCB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('uniqueARTNumber')?.reset();
    });

    this.sexCB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('sex')?.reset();
    });

    this.pmtctCB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('pmtct')?.reset();
    });

    this.pendCB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('pendingStatus')?.reset();
    });

    this.HVLCB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('hvl')?.reset();
    });

    this.eac3CB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('eac3Completed')?.reset();
    });

    this.phoneCB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('phoneNumber')?.reset();
    });

    this.regimenCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val) this.advancedFilterFormGroup.get('regimen')?.reset();
      });

    this.eligibleCB.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((val) => {
        if (!val) this.advancedFilterFormGroup.get('eligible')?.reset();
      });

    this.iitCB.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      if (!val) this.advancedFilterFormGroup.get('iit')?.reset();
    });

    if (this.currentAdvancedFilters) {
      Object.keys(this.currentAdvancedFilters).forEach((key: string) => {
        switch (key) {
          case 'eligible':
            this.eligibleCB.setValue(true);
            break;
          case 'hvl':
            this.HVLCB.setValue(true);
            break;
          case 'eac3Completed':
            this.eac3CB.setValue(true);
            break;
          case 'pmtct':
            this.pmtctCB.setValue(true);
            break;
          case 'pendingStatus':
            this.pendCB.setValue(true);
            break;
          default:
            break;
        }
      });

      this.advancedFilterFormGroup.patchValue(this.currentAdvancedFilters);
    }
  }

  updateAdvencedFilters() {
    this.advancedFiltersUpdated.emit(this.advancedFilterFormGroup.value);
  }
}
