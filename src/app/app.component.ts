import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavigationEnd, Router } from '@angular/router';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import firebase from 'firebase/app';
import { PushNotification } from './interfaces/push-notification';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MdbSidenavComponent;

  sidenavHidden = true;
  sidenavCollapsed = false;

  notifs!: Observable<any[]>;

  activeRoute = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd),
    map((event: any) => {
      return event.url.split('/')[1].replace(/-/g, ' ');
    })
  );

  sidenavLinks = [
    { route: 'dashboard', icon: 'fas fa-chart-line' },
    { route: 'entry-form', icon: 'fas fa-info-circle' },
    { route: 'database', icon: 'fas fa-table' },
    { route: 'report', icon: 'fas fa-book' },
  ];

  adminLinks = [{ route: 'users', icon: 'fas fa-user' }];

  constructor(
    private router: Router,
    public authServ: AuthService,
    private afs: AngularFirestore,
    private pushNotifServ: PushNotificationService
  ) {
    this.notifs = pushNotifServ.pushNotifs$;
  }

  routeToLink(route: string) {
    return route.replace(/-/g, ' ');
  }

  signOut() {
    this.sidenav.hide();
    this.authServ.signOut();
  }

  clearPushNotifs() {
    this.pushNotifServ.clearPushNotifs();
  }
}
