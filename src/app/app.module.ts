import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MdbAutocompleteModule } from 'mdb-angular-ui-kit/autocomplete';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbChartModule } from 'mdb-angular-ui-kit/charts';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDatepickerModule } from 'mdb-angular-ui-kit/datepicker';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbLoadingModule } from 'mdb-angular-ui-kit/loading';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbNotificationModule } from 'mdb-angular-ui-kit/notification';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRatingModule } from 'mdb-angular-ui-kit/rating';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollbarModule } from 'mdb-angular-ui-kit/scrollbar';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbSelectModule } from 'mdb-angular-ui-kit/select';
import { MdbSidenavModule } from 'mdb-angular-ui-kit/sidenav';
import { MdbStepperModule } from 'mdb-angular-ui-kit/stepper';
import { MdbStickyModule } from 'mdb-angular-ui-kit/sticky';
import { MdbTableModule } from 'mdb-angular-ui-kit/table';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTimepickerModule } from 'mdb-angular-ui-kit/timepicker';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportComponent } from './pages/report/report.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { EntryFormComponent } from './pages/entry-form/entry-form.component';
import { AdminComponent } from './pages/admin/admin.component';

import { firebaseConfig } from 'src/environments/firebaseConfig';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {
  AngularFireFunctionsModule,
  USE_EMULATOR,
} from '@angular/fire/functions';

import { EntriesComponent } from './pages/entries/entries.component';
import { NewUserComponent } from './modals/new-user/new-user.component';
import { EditUserComponent } from './modals/edit-user/edit-user.component';
import { NewUserCreatedAlertComponent } from './alerts/new-user-created-alert/new-user-created-alert.component';
import { UserDeletedAlertComponent } from './alerts/user-deleted-alert/user-deleted-alert.component';
import { LoadingComponent } from './modals/loading/loading.component';
import { LogoComponent } from './components/logo/logo.component';
import { NewVlComponent } from './modals/new-vl/new-vl.component';
import { EditVlComponent } from './modals/edit-vl/edit-vl.component';
import { UserLoadedAlertComponent } from './alerts/user-loaded-alert/user-loaded-alert.component';
import { EligibleByDayComponent } from './charts/eligible-by-day/eligible-by-day.component';
import { EligibleByWeekComponent } from './charts/eligible-by-week/eligible-by-week.component';
import { EligibleByMonthComponent } from './charts/eligible-by-month/eligible-by-month.component';
import { EligibleBySexComponent } from './charts/eligible-by-sex/eligible-by-sex.component';
import { ViewCvhComponent } from './modals/view-cvh/view-cvh.component';
import { UserUpdatedAlertComponent } from './alerts/user-updated-alert/user-updated-alert.component';
import { AlertComponent } from './alerts/alert/alert.component';
import { ClinicVisitAddedComponent } from './alerts/clinic-visit-added/clinic-visit-added.component';
import { DatabaseComponent } from './pages/database/database.component';
import { EligibleByTimeComponent } from './charts/eligible-by-time/eligible-by-time.component';
import { NotificationsComponent } from './popovers/notifications/notifications.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EligibleByRegimenComponent } from './charts/eligible-by-regimen/eligible-by-regimen.component';
import { CvsByIitComponent } from './charts/cvs-by-iit/cvs-by-iit.component';
import { EligibleByPMTCTComponent } from './charts/eligible-by-pmtct/eligible-by-pmtct.component';
import { PieChartsComponent } from './charts/pie-charts/pie-charts.component';

import 'chartjs-plugin-datalabels';
import { UsersComponent } from './pages/admin/users/users.component';
import { UserEditedALertComponent } from './alerts/user-edited-alert/user-edited-alert.component';
import { ImportAndExportComponent } from './pages/admin/import-and-export/import-and-export.component';
import { ImportEntriesComponent } from './modals/import-entries/import-entries.component';
import { EligibleByAgeComponent } from './charts/eligible-by-age/eligible-by-age.component';
import { ImportEntriesPreviewComponent } from './modals/import-entries-preview/import-entries-preview.component';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    DashboardComponent,
    ReportComponent,
    SettingsComponent,
    EntryFormComponent,
    AdminComponent,
    EntriesComponent,
    NewUserComponent,
    EditUserComponent,
    NewUserCreatedAlertComponent,
    UserDeletedAlertComponent,
    LoadingComponent,
    LogoComponent,
    NewVlComponent,
    EditVlComponent,
    UserLoadedAlertComponent,
    EligibleByDayComponent,
    EligibleByWeekComponent,
    EligibleByMonthComponent,
    EligibleBySexComponent,
    ViewCvhComponent,
    UserUpdatedAlertComponent,
    AlertComponent,
    ClinicVisitAddedComponent,
    DatabaseComponent,
    EligibleByTimeComponent,
    NotificationsComponent,
    EligibleByRegimenComponent,
    CvsByIitComponent,
    EligibleByPMTCTComponent,
    PieChartsComponent,
    UsersComponent,
    UserEditedALertComponent,
    ImportAndExportComponent,
    ImportEntriesComponent,
    EligibleByAgeComponent,
    ImportEntriesPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,
    MdbAutocompleteModule,
    MdbCarouselModule,
    MdbChartModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDatepickerModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbLoadingModule,
    MdbModalModule,
    MdbNotificationModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRatingModule,
    MdbRippleModule,
    MdbScrollbarModule,
    MdbScrollspyModule,
    MdbSelectModule,
    MdbSidenavModule,
    MdbStepperModule,
    MdbStickyModule,
    MdbTableModule,
    MdbTabsModule,
    MdbTimepickerModule,
    MdbTooltipModule,
    MdbValidationModule,

    NgxPrintModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireFunctionsModule,
    NgxChartsModule,
  ],
  // providers: [{ provide: USE_EMULATOR, useValue: ['localhost', 5001] }],
  bootstrap: [AppComponent],
})
export class AppModule {}
