import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../db.service';
import { device } from '../models/device';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface viewFunc {
  view: string,
  value: string
}

export interface timeout {
  value: number,
  view: string
}

export interface partner {
  view: string,
  value: number
}

@Component({
  selector: 'app-edit-device-dialog',
  templateUrl: './edit-device-dialog.component.html',
  styleUrls: ['./edit-device-dialog.component.scss']
})
export class EditDeviceDialogComponent implements OnInit {
  device: device = {
    id: 0,
    name: '',
    func: '',
    status: 0,
    timeout: 0
  }
  form!: FormGroup;
  idControl = new FormControl(null, Validators.required);
  nameControl = new FormControl(null, Validators.required);
  funcControl = new FormControl(null, Validators.required);
  timeoutControl = new FormControl(0, Validators.required);
  funcList: viewFunc[] = [
    {view: '入口', value: 'enter'},
    {view: '出口', value: 'exit'}
  ];
  timeoutOptions: timeout[] = [
    {value: 60 * 60 * 1000, view: '60分'},
    {value: 30 * 60 * 1000, view: '30分'},
    {value: 15 * 60 * 1000, view: '15分'},
    {value: 15 * 1000, view: '15秒'}
  ];
  isAdmin: boolean = false;
  partnerOptions: partner[] = [];
  partnerControl = new FormControl(null);
  devices: device[] = [];


  constructor(
    public dialogRef: MatDialogRef<EditDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number,
    private dbService: DbService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAdmin();
    this.getDevices();
    //this.getDevice(this.id);
    this.form = this.fb.group({
      id: this.idControl,
      name: this.nameControl,
      func: this.funcControl,
      timeout: this.timeoutControl,
      partner: this.partnerControl
    });
  }

  getDevice(id: number): void {
    this.dbService.get<device>('device', id)
    .subscribe(device => {
      this.device = device;
      this.funcControl.setValue(this.device.func);
      this.timeoutControl.setValue(this.device.timeout);
      if(device.partnerId){
        this.partnerControl.setValue(this.device.partnerId);
      }
    });
  }

  getDevices(): void {
    this.dbService.getAll<device>('devices')
    .subscribe(devices => {
      this.devices = devices;
      this.device = this.devices.find(device => device.id === this.id)!;
      this.funcControl.setValue(this.device.func);
      this.timeoutControl.setValue(this.device.timeout);
      this.setPartners();
      if(this.device.partnerId){
        this.partnerControl.setValue(this.device.partnerId);
      }
    });
  }

  setPartners(): void {
    if(this.device.func === this.form.get('func')?.value){
      this.partnerControl.setValue(this.device.partnerId);
    }
    else{
      this.partnerControl.setValue(null);
    }
    let buf: partner[] = [];
    this.devices.filter(device => {
      if((device.partnerId !== 0 && device.id !== this.device.partnerId) || device.func === this.form.get('func')?.value || device.id === this.id){
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

  getAdmin(): void {
    this.dbService.getUser()
    .subscribe(user => this.isAdmin = user.admin);
  }

  onSave(): void {
    this.device.func = this.form.get('func')?.value;
    this.device.timeout = this.form.get('timeout')?.value;
    this.device.partnerId = this.form.get('partner')?.value ? this.form.get('partner')?.value : 0;
    this.dbService.update<device>('device', this.device)
    .subscribe(result => {
      if(result){
        this.snackBar.open('更新しました', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('更新できませんでした', '閉じる', {duration: 7000});
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
