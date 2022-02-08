import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NfcComponent } from './nfc/nfc.component';

const routes: Routes = [
  { path: "", redirectTo: "nfc", pathMatch: "full" },
  { path: "nfc", component: NfcComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
