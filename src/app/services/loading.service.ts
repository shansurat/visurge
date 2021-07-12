import { Injectable } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LoadingComponent } from '../modals/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loadingComp!: MdbModalRef<LoadingComponent>;

  constructor(private modalServ: MdbModalService) {}

  openLoadingModal() {
    this.loadingComp = this.modalServ.open(LoadingComponent, {
      modalClass: 'modal-fullscreen',
    });
  }

  closeLoadingModal() {
    this.loadingComp.close();
  }
}
