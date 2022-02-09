import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NfcComponent } from './nfc/nfc.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MemberComponent } from './member/member.component';
import { AuthGuard } from './auth.guard';
import { StatusListComponent } from './status-list/status-list.component';
import { LogComponent } from './log/log.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard],
    children:[
      { path: 'member', component: MemberComponent },
      { path: 'statusList', component: StatusListComponent },
      { path: 'log', component: LogComponent }
    ]
  },
  { path: 'nfc', component: NfcComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
