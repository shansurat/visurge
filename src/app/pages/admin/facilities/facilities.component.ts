import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationService } from 'mdb-angular-ui-kit/notification';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { facilities } from 'src/app/constants/facilities';
import { Facility } from 'src/app/interfaces/facility';
import { EditFacilityComponent } from 'src/app/modals/edit-facility/edit-facility.component';
import { NewFacilityComponent } from 'src/app/modals/new-facility/new-facility.component';
import { AuthService } from 'src/app/services/auth.service';
import { FacilitiesService } from 'src/app/services/facilities.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss'],
})
export class FacilitiesComponent implements OnInit {
  @ViewChild('table') table!: MdbTableDirective<Facility>;

  isLoading = false;

  config = {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    wheelSpeed: 1,
    wheelPropagation: true,
    swipeEasing: true,
    minScrollbarLength: null,
    maxScrollbarLength: null,
    scrollingThreshold: 1000,
    useBothWheelAxes: false,
    suppressScrollX: false,
    suppressScrollY: false,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
  };

  facilities$: BehaviorSubject<Facility[]> = new BehaviorSubject(
    [] as Facility[]
  );

  headers = ['#', 'Code', 'Site', 'State', ''];

  constructor(
    private afs: AngularFirestore,
    private modalServ: MdbModalService,
    public authServ: AuthService,
    private notifServ: MdbNotificationService,
    public facilitiesServ: FacilitiesService
  ) {
    this.afs
      .collection('facilities')
      .valueChanges()
      .pipe(
        map((facilities) => this.facilities$.next(facilities as Facility[]))
      );
  }

  ngOnInit(): void {}

  openNewFacilityModal() {
    this.modalServ.open(NewFacilityComponent, {
      modalClass: 'modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    });
  }

  openFacilityUserModal(facility: Facility) {
    this.modalServ.open(EditFacilityComponent, {
      modalClass: 'modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
      data: { facility },
    });
  }

  deleteFacility(uid: string) {
    this.afs
      .collection('facilities')
      .doc(uid)
      .delete()
      .then(() => {
        console.log('Facility deleted.');
      });
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }

  filterFn(data: any, searchTerm: string): boolean {
    // tslint:disable-next-line: prefer-const

    return Object.keys(data).some((key) => {
      return data[key].toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
