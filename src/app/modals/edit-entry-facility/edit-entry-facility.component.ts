import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { BehaviorSubject } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { Facility } from 'src/app/interfaces/facility';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'app-edit-entry-facility',
  templateUrl: './edit-entry-facility.component.html',
  styleUrls: ['./edit-entry-facility.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditEntryFacilityComponent implements OnInit {
  id!: string;
  facilityId!: string;
  loading = false;

  facilityFormControl: FormControl = new FormControl('', Validators.required);
  constructor(
    private afs: AngularFirestore,
    public modalRef: MdbModalRef<EditEntryFacilityComponent>,
    public facilitiesServ: FacilitiesService
  ) {}

  ngOnInit(): void {
    console.log(this.facilityId);
    this.facilityFormControl.setValue(this.facilityId);
  }

  saveFacility() {
    this.modalRef.close(this.facilityFormControl.value);
  }
}
