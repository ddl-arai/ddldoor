import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NfcComponent } from './components/nfc/nfc.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MemberComponent } from './components/member/member.component';
import { AuthGuard } from './guards/auth.guard';
import { LogComponent } from './components/log/log.component';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { AccountComponent } from './components/account/account.component';
import { ResetComponent } from './components/reset/reset.component';
//import { WorkHoursComponent } from './work-hours/work-hours.component';
import { WorkHoursChartComponent } from './components/work-hours-chart/work-hours-chart.component';
import { AdminGuard } from './guards/admin.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HelpComponent } from './components/help/help.component';
import { ResetInitComponent } from './components/reset-init/reset-init.component';
import { InitGuard } from './guards/init.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: "reset/:token", component: ResetComponent },
  { path: 'init', component: ResetInitComponent, canActivate: [AuthGuard] },
  { path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard, InitGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent },
      { path: 'member', component: MemberComponent },
      //{ path: 'statusList', component: StatusListComponent },
      { path: 'log', component: LogComponent },
      { path: 'nfc', component: NfcComponent },
      { path: 'deviceList', component: DeviceListComponent },
      { path: 'workHours', component: WorkHoursChartComponent },
      { path: 'maintenance', component: AccountComponent, canActivate: [AdminGuard] },
      { path: 'help', component: HelpComponent }
    ]
  },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
