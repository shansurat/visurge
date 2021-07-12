import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthComponentGuard } from './guards/auth-component.guard';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EntriesComponent } from './pages/entries/entries.component';
import { EntryFormComponent } from './pages/entry-form/entry-form.component';
import { ReportComponent } from './pages/report/report.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: 'auth', component: AuthComponent, canActivate: [AuthComponentGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'entries',
    component: EntriesComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'entry-form',
    component: EntryFormComponent,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [AuthGuard, UserGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
