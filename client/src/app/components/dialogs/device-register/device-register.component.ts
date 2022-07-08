import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { device } from '../../../models/device';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DbService } from '../../../services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface viewFunc {
  view: string,
  value: string
}

export interface partner {
  view: string,
  value: number
}

@Component({
  selector: 'app-device-register',
  templateUrl: './device-register.component.html',
  styleUrls: ['./device-register.component.scss']
})
export class DeviceRegisterComponent implements OnInit {
  idOptions: number[] = [...Array(100).keys()].map(i => ++i);
  form!: FormGroup;
  idControl = new FormControl(null, Validators.required);
  nameControl = new FormControl(null, Validators.required);
  funcControl = new FormControl(null, Validators.required);
  funcList: viewFunc[] = [
    {view: '入口', value: 'enter'},
    {view: '出口', value: 'exit'}
  ];
  partnerOptions: partner[] = [];
  partnerControl = new FormControl(null);
  devices: device[] = [];
  enableControl = new FormControl(false);
  virtual: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeviceRegisterComponent>,
    private fb: FormBuilder,
    private dbService: DbService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public usedIds: number[]
  ) { }

  ngOnInit(): void {
    this.idOptions = this.idOptions.filter(i => !this.usedIds.includes(i));
    this.form = this.fb.group({
      id: this.idControl,
      name: this.nameControl,
      func: this.funcControl,
      partner: this.partnerControl,
      enable: this.enableControl
    });
    this.virtual = this.form.get('enable')?.value;
    this.enableControl.valueChanges.subscribe(value => {
      this.virtual = value;
    })
    this.getDevices();
  }

  getDevices(): void {
    this.dbService.getAll<device>('devices')
    .subscribe(devices => {
      this.devices = devices;
    });
  }

  setPartners(): void {
    let buf: partner[] = [];
    this.devices.filter(device => {
      if(device.partnerId || device.func === this.form.get('func')?.value){
        return false;
      }
      return true;
    }).forEach(device => {
      buf.push({
        view: device.name,
        value: device.id
      });
    });
    this.partnerOptions = buf;
  }

  onSubmit(): void {
    let device: device = {
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      func: this.form.get('func')?.value,
      virtual: this.form.get('enable')?.value,
      status: 0,
      timeout: 60 * 60 * 1000,
      partnerId: this.form.get('partner')?.value ? this.form.get('partner')?.value : 0
    }
    this.dbService.add<device>('device', device)
    .subscribe(result => {
      if(result){
        this.snackBar.open('登録しました', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('登録できませんでした', '閉じる', {duration: 7000});
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
