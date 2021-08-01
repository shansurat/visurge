import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject } from 'rxjs';

interface ActiveFilter {
  header: string;
  type: string;
  value: any;
}

@Component({
  selector: 'app-new-advanced-active-filter',
  templateUrl: './new-advanced-active-filter.component.html',
  styleUrls: ['./new-advanced-active-filter.component.scss'],
})
export class NewAdvancedActiveFilterComponent implements OnInit {
  activeFilters!: ActiveFilter[];

  headers = [
    'Entry Date',
    'Facility',
    'Unique ART Number',
    'ART Start Date',
    'Sex',
    'Age',
    'Phone Number',
    'Regimen',
    'Start/ Transition Date',
    'Pregnant/Breastfeeding',
    'PMTCT Enrollment Start Date',
    'High Viral Load',
    'EAC-3 Completed',
    'Pending Status',
    'EAC-3 Completion Date',
    'Pending Status Date',
    'Eligibility',
  ];

  headers_dates = [
    'Entry Date',
    'ART Start Date',
    'PMTCT Enrollment Start Date',
    'Start/ Transition Date',
    'EAC-3 Completion Date',
    'Pending Status Date',
  ];

  newActiveFilterFormGroup!: FormGroup;

  constructor(
    public modalRef: MdbModalRef<NewAdvancedActiveFilterComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.newActiveFilterFormGroup = this.fb.group({
      header: ['', [Validators.required]],
      value: ['', [Validators.required]],
      type: ['exact'],
    });
  }

  get headerFormControl() {
    return this.newActiveFilterFormGroup.get('header') as FormControl;
  }

  get valueFormControl() {
    return this.newActiveFilterFormGroup.get('value') as FormControl;
  }
  get typeFormControl() {
    return this.newActiveFilterFormGroup.get('type') as FormControl;
  }

  addFilter() {
    this.modalRef.close(this.newActiveFilterFormGroup.value);
  }
}
