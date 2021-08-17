import { NgModule, isDevMode } from '@angular/core';
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
import {
  AngularFirestoreModule,
  SETTINGS as FIRESTORE_SETTINGS,
} from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/functions';

import { environment } from 'src/environments/environment';

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
import { FacilitiesComponent } from './pages/admin/facilities/facilities.component';
import { NewFacilityComponent } from './modals/new-facility/new-facility.component';
import { EditFacilityComponent } from './modals/edit-facility/edit-facility.component';
import { SupportComponent } from './pages/support/support.component';
import { AbsoluteValuePipe } from './pipes/absolute-value.pipe';
import { EligibleByTimeExpectedComponent } from './charts/eligible-by-time-expected/eligible-by-time-expected.component';
import { NewAdvancedActiveFilterComponent } from './modals/new-advanced-active-filter/new-advanced-active-filter.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SaveEntryComponent } from './modals/save-entry/save-entry.component';
import { IndividualComponent } from './pages/report/individual/individual.component';
import { ViewVlhComponent } from './modals/view-vlh/view-vlh.component';
import { AdvancedFiltersComponent } from './pages/database/advanced-filters/advanced-filters.component';
import { AreYouSureComponent } from './modals/are-you-sure/are-you-sure.component';
import { DatabaseNgCdkComponent } from './pages/database-ng-cdk/database-ng-cdk.component';
import { MiniDashboardComponent } from './pages/entry-form/mini-dashboard/mini-dashboard.component';

import firebase from 'firebase/app';
import { ViralLoadCoverageComponent } from './pages/dashboard/viral-load-coverage/viral-load-coverage.component';
import { ExportEntriesComponent } from './modals/export-entries/export-entries.component';
import { ExportEntriesPreviewComponent } from './modals/export-entries/export-entries-preview/export-entries-preview.component';
import { ChangeFacilityComponent } from './modals/change-facility/change-facility.component';
import { EditEntryFacilityComponent } from './modals/edit-entry-facility/edit-entry-facility.component';
import { EditEntryUanComponent } from './modals/edit-entry-uan/edit-entry-uan.component';

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
    FacilitiesComponent,
    NewFacilityComponent,
    EditFacilityComponent,
    SupportComponent,
    AbsoluteValuePipe,
    EligibleByTimeExpectedComponent,
    NewAdvancedActiveFilterComponent,
    SaveEntryComponent,
    IndividualComponent,
    ViewVlhComponent,
    AdvancedFiltersComponent,
    AreYouSureComponent,
    DatabaseNgCdkComponent,
    MiniDashboardComponent,
    ViralLoadCoverageComponent,
    ExportEntriesComponent,
    ExportEntriesPreviewComponent,
    ChangeFacilityComponent,
    EditEntryFacilityComponent,
    EditEntryUanComponent,
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

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence({
      experimentalForceOwningTab: true,
    }),
    AngularFireFunctionsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: USE_FUNCTIONS_EMULATOR,
      useValue: environment.emulator ? ['localhost', 5001] : undefined,
    },
    {
      provide: FIRESTORE_SETTINGS,
      useValue: { cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
