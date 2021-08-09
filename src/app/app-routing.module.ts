import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthComponentGuard } from './guards/auth-component.guard';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { FacilitiesComponent } from './pages/admin/facilities/facilities.component';
import { ImportAndExportComponent } from './pages/admin/import-and-export/import-and-export.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DatabaseNgCdkComponent } from './pages/database-ng-cdk/database-ng-cdk.component';
import { DatabaseComponent } from './pages/database/database.component';
import { EntriesComponent } from './pages/entries/entries.component';
import { EntryFormComponent } from './pages/entry-form/entry-form.component';
import { IndividualComponent } from './pages/report/individual/individual.component';
import { ReportComponent } from './pages/report/report.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SupportComponent } from './pages/support/support.component';
import {
  AngularFireAuthGuard,
  hasCustomClaim,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AngularFireAuthGuard, AdminGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'import-and-export', component: ImportAndExportComponent },
      { path: 'facilities', component: FacilitiesComponent },
    ],
  },

  {
    path: 'entry-form',
    component: EntryFormComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },

  {
    path: 'database',
    component: DatabaseComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },

  {
    path: 'report',
    component: ReportComponent,
    canActivate: [AngularFireAuthGuard],
    children: [{ path: 'individual', component: IndividualComponent }],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'support',
    component: SupportComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'user-settings',
    component: SettingsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToDashboard },
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
