import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MdbSidenavComponent } from 'mdb-angular-ui-kit/sidenav';
import { filter, map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

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

  activeRoute = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd),
    map((event: any) => {
      return event.url.split('/')[1].replace(/-/g, ' ');
    })
  );

  sidenavLinks = [
    'admin',
    'dashboard',
    'entries',
    'entry-form',
    'report',
    'settings',
  ];

  adminLinks = ['dashboard', 'admin', 'entries', 'settings'];

  constructor(private router: Router, public authServ: AuthService) {}

  routeToLink(route: string) {
    return route.replace(/-/g, ' ');
  }

  signOut() {
    this.sidenav.hide();

    this.authServ.signOut();
  }
}
