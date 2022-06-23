import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timer, Subscription } from 'rxjs';
import { DbService } from '../db.service';
import { device } from '../models/device';
import { log } from '../models/log';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface deviceOption {
  view: string,
  id: number
}

export interface dialogData {
  id: number,
  name: string
}

@Component({
  selector: 'app-stamp-dialog',
  templateUrl: './stamp-dialog.component.html',
  styleUrls: ['./stamp-dialog.component.scss']
})
export class StampDialogComponent implements OnInit, OnDestroy {
  timer = timer(0, 1000);
  subscription: Subscription = new Subscription();
  clock: string = '';
  deviceOptions: deviceOption[] = [];
  deviceId: number = 0;
  devices: device[] = [];
  now: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<StampDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.startClock();
    this.getDevices();
  }

  startClock(): void {
    this.subscription = this.timer.subscribe(() => {
      this.now = new Date();
      this.clock = `${this.now.getHours()}:${('0' + String(this.now.getMinutes())).slice(-2)}:${('0' + String(this.now.getSeconds())).slice(-2)}`;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onStamp(): void {
    let device = this.devices.find(el => el.id === this.deviceId);
    if(!device){
      this.snackBar.open('エラーが発生しました', '閉じる', {duration: 5000});
      return;
    }
    else{
      this.dbService.add<log>('log', {
        sec: Math.floor(this.now.getTime() / 1000),
        idm: '',
        id: this.data.id,
        name: this.data.name,
        devid: device.id,
        devName: device.name,
        result: 11
      })
      .subscribe(result => {
        if(result){
          let content = '退勤';
          if(device!.func === 'enter' ) content = '出勤';
          this.snackBar.open(`${content}で打刻しました`, '閉じる', {duration: 5000});
          this.dialogRef.close();
        }
        else{
          this.snackBar.open('打刻できませんでした', '閉じる', {duration: 5000});
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDevices(): void {
    this.dbService.getAll<device>('devices')
    .subscribe(devices => {
      this.devices = devices.filter(dev => dev.virtual);
      this.devices.forEach(device => {
        if(this.deviceId === 0){
          this.deviceId = device.id;
        }
        this.deviceOptions.push({
          view: device.name,
          id: device.id
        });
      });
    });
  }
}
