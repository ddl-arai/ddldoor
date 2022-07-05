import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { device } from '../../../models/device';
import { DbService } from '../../../services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer, Subscription } from 'rxjs';
import { SpinnerService } from '../../../services/spinner.service';
import { log } from '../../../models/log';

export interface dialogData {
  id: number,
  name: string,
  timeout: string
}

@Component({
  selector: 'app-device-tmpopen',
  templateUrl: './device-tmpopen.component.html',
  styleUrls: ['./device-tmpopen.component.scss']
})
export class DeviceTmpopenComponent implements OnInit, OnDestroy {
  timer = timer(0, 1000);
  subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<DeviceTmpopenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private dbService: DbService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onTmpOpen(): void {
    this.spinnerService.attach();
    let device: device = {
      id: this.data.id,
      name: this.data.name,
      func: '',
      status: 1,
      timeout: 0
    }
    this.dbService.update<device>('device/tmp', device)
    .subscribe(result => {
      if(result){
        this.subscription = this.timer.subscribe(count => {
          /* Get open status */
          this.dbService.get<device>('device', this.data.id)
          .subscribe(device => {
            let opened = device.open; 

            /* Opened */
            if(opened){
              this.dbService.add<any>('log', {
                sec: Math.floor(Date.now() / 1000),
                devid: device.id,
                devName: device.name,
                result: 7
              })
              .subscribe(() => {
                this.subscription.unsubscribe();
                this.snackBar.open('一時解錠しました', '閉じる', {duration: 5000});
                this.spinnerService.detach();
                this.dialogRef.close();
                return;
              });
            }

            /* Timeout */
            if(count > 5){
              device.status = 0;
              this.dbService.update<device>('device/tmp', device)
              .subscribe(result => {
                if(result){
                  this.subscription.unsubscribe();
                  this.snackBar.open('デバイスからの応答がありませんでした', '閉じる', {duration: 7000});
                  this.spinnerService.detach();
                  this.dialogRef.close();
                  return;
                }
                else{
                  this.subscription.unsubscribe();
                  this.snackBar.open('エラーが発生しました', '閉じる', {duration: 5000});
                }
              });
            }
          });
        });
      }
      else{
        this.snackBar.open('一時解錠できませんでした', '閉じる', {duration: 7000});
        this.spinnerService.detach();
        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
