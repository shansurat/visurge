import { Injectable } from '@angular/core';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ViewCvhComponent } from '../modals/view-cvh/view-cvh.component';

@Injectable({
  providedIn: 'root',
})
export class ViewCVHService {
  constructor(private modalServ: MdbModalService) {}

  public viewCVH(cvh: any, cv?: any) {
    this.modalServ.open(ViewCvhComponent, {
      data: {
        cvh,
        cv,
      },
      modalClass:
        'modal-dialog-centered modal-lg modal-fullscreen-md-down modal-dialog-scrollable',
    });
  }
}
