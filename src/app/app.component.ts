import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { PushNotificationService } from './services/push-notification.service';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MdbSidenavComponent;
  loading = false;

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
    { route: 'support', icon: 'fas fa-phone' },
  ];

  adminLinks = [
    { route: 'users', icon: 'fas fa-user' },
    { route: 'facilities', icon: 'fas fa-landmark' },
  ];

  constructor(
    private router: Router,
    public authServ: AuthService,
    private pushNotifServ: PushNotificationService,
    public layoutServ: LayoutService
  ) {
    this.notifs = pushNotifServ.pushNotifs$;
    this.router.events.subscribe((event: any) => {
      console.log(event);
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
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
