import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatPaginatorIntlJa } from './mat-paginator-jp';

/* Material */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';


/* Component */
import { AppComponent } from './app.component';
import { NfcComponent } from './nfc/nfc.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MemberComponent } from './member/member.component';
import { NaviComponent } from './navi/navi.component';
import { MemberDialogComponent } from './member-dialog/member-dialog.component';
import { EditMemberDialogComponent } from './edit-member-dialog/edit-member-dialog.component';
import { StatusListComponent } from './status-list/status-list.component';
import { LogComponent } from './log/log.component';
import { CardDialogComponent } from './card-dialog/card-dialog.component';
import { EditCardDialogComponent } from './edit-card-dialog/edit-card-dialog.component';
import { DeleteMemberDialogComponent } from './delete-member-dialog/delete-member-dialog.component';
import { DeleteCardDialogComponent } from './delete-card-dialog/delete-card-dialog.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceDialogComponent } from './device-dialog/device-dialog.component';
import { EditDeviceDialogComponent } from './edit-device-dialog/edit-device-dialog.component';
import { DeleteDeviceDialogComponent } from './delete-device-dialog/delete-device-dialog.component';
import { AccountComponent } from './account/account.component';
import { ResetComponent } from './reset/reset.component';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';
import { DeleteLogDialogComponent } from './delete-log-dialog/delete-log-dialog.component';
import { WorkHoursComponent } from './work-hours/work-hours.component';
import { WorkHoursChartComponent } from './work-hours-chart/work-hours-chart.component';
import { DeviceTmpopenDialogComponent } from './device-tmpopen-dialog/device-tmpopen-dialog.component';
import { StampDialogComponent } from './stamp-dialog/stamp-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    NfcComponent,
    LoginComponent,
    HomeComponent,
    MemberComponent,
    NaviComponent,
    MemberDialogComponent,
    EditMemberDialogComponent,
    StatusListComponent,
    LogComponent,
    CardDialogComponent,
    EditCardDialogComponent,
    DeleteMemberDialogComponent,
    DeleteCardDialogComponent,
    DeviceListComponent,
    DeviceDialogComponent,
    EditDeviceDialogComponent,
    DeleteDeviceDialogComponent,
    AccountComponent,
    ResetComponent,
    DeleteAccountDialogComponent,
    DeleteLogDialogComponent,
    WorkHoursComponent,
    WorkHoursChartComponent,
    DeviceTmpopenDialogComponent,
    StampDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableExporterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatDividerModule,
    ClipboardModule,
    MatCheckboxModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
    MatTabsModule,
    MatExpansionModule
  ],
  entryComponents: [
    MatSpinner
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlJa }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
