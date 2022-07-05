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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatPaginatorIntlJa } from './mat-paginator-jp';
import { MarkdownModule } from 'ngx-markdown';
import { QRCodeModule } from 'angularx-qrcode';

/* Material */
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';

/* Component */
import { AppComponent } from './app.component';
import { NfcComponent } from './components/nfc/nfc.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MemberComponent } from './components/member/member.component';
import { NaviComponent } from './components/navi/navi.component';
import { MemberDialogComponent } from './components/dialogs/member-dialog/member-dialog.component';
import { MemberEditComponent } from './components/dialogs/member-edit/member-edit.component';
import { StatusListComponent } from './components/status-list/status-list.component';
import { LogComponent } from './components/log/log.component';
import { CardRegisterComponent } from './components/dialogs/card-register/card-register.component';
import { CardEditComponent } from './components/dialogs/card-edit/card-edit.component';
import { MemberDeleteComponent } from './components/dialogs/member-delete/member-delete.component';
import { CardDeleteComponent } from './components/dialogs/card-delete/card-delete.component';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DeviceRegisterComponent } from './components/dialogs/device-register/device-register.component';
import { DeviceEditComponent } from './components/dialogs/device-edit/device-edit.component';
import { DeviceDeleteComponent } from './components/dialogs/device-delete/device-delete.component';
import { AccountComponent } from './components/account/account.component';
import { ResetComponent } from './components/reset/reset.component';
import { AccountDeleteComponent } from './components/dialogs/account-delete/account-delete.component';
import { AccountLogDeleteComponent } from './components/dialogs/account-log-delete/account-log-delete.component';
import { WorkHoursComponent } from './components/work-hours/work-hours.component';
import { WorkHoursChartComponent } from './components/work-hours-chart/work-hours-chart.component';
import { DeviceTmpopenComponent } from './components/dialogs/device-tmpopen/device-tmpopen.component';
import { StampDialogComponent } from './components/stamp-dialog/stamp-dialog.component';
import { NaviMemberLinkComponent } from './components/dialogs/navi-member-link/navi-member-link.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatprogressspinnerComponent } from './components/matprogressspinner/matprogressspinner.component';
import { RouterModule } from '@angular/router';
import { HomeUpdateComponent } from './components/dialogs/home-update/home-update.component';
import { HelpComponent } from './components/help/help.component';
import { NaviQrComponent } from './components/dialogs/navi-qr/navi-qr.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { LayoutModule } from '@angular/cdk/layout';
import { ResetInitComponent } from './components/reset-init/reset-init.component';
import { TutrialModalComponent } from './components/tutrial-modal/tutrial-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NfcComponent,
    LoginComponent,
    HomeComponent,
    MemberComponent,
    NaviComponent,
    MemberDialogComponent,
    MemberEditComponent,
    StatusListComponent,
    LogComponent,
    CardRegisterComponent,
    CardEditComponent,
    MemberDeleteComponent,
    CardDeleteComponent,
    DeviceListComponent,
    DeviceRegisterComponent,
    DeviceEditComponent,
    DeviceDeleteComponent,
    AccountComponent,
    ResetComponent,
    AccountDeleteComponent,
    AccountLogDeleteComponent,
    WorkHoursComponent,
    WorkHoursChartComponent,
    DeviceTmpopenComponent,
    StampDialogComponent,
    NaviMemberLinkComponent,
    MatprogressspinnerComponent,
    HomeUpdateComponent,
    HelpComponent,
    NaviQrComponent,
    DashboardComponent,
    ResetInitComponent,
    TutrialModalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
    MatTableExporterModule.forRoot({ xlsxLightWeight: true }),
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatDividerModule,
    ClipboardModule,
    MatCheckboxModule,
    MatTooltipModule,
    OverlayModule,
    ScrollingModule,
    PortalModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    RouterModule,
    MatChipsModule,
    MarkdownModule.forRoot(),
    QRCodeModule,
    MatGridListModule,
    LayoutModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlJa },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { panelClass: ['custom-snack-bar'] } },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
