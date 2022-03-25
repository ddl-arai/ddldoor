import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { device } from '../models/device';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer, Subscription } from 'rxjs';
import { SpinnerService } from '../spinner.service';

export interface dialogData {
  id: number,
  name: string,
  timeout: string
}

@Component({
  selector: 'app-device-tmpopen-dialog',
  templateUrl: './device-tmpopen-dialog.component.html',
  styleUrls: ['./device-tmpopen-dialog.component.scss']
})
export class DeviceTmpopenDialogComponent implements OnInit, OnDestroy {
  timer = timer(0, 1000);
  subscription: Subscription = new Subscription();
  opened: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeviceTmpopenDialogComponent>,
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
          console.log('Active');
          /* Get open status */
          this.dbService.get<device>('device', this.data.id)
          .subscribe(device => {
            if(device.open){
              this.opened = device.open;
            }

            /* Opened */
            if(this.opened){
              this.subscription.unsubscribe();
              this.snackBar.open('一時解錠しました', '閉じる', {duration: 5000});
              this.spinnerService.detach();
              this.dialogRef.close();
              return;
            }

            /* Timeout */
            if(count > 5){
              device.status = 0;
              this.dbService.update<device>('device/tmp', device)
              .subscribe(result => {
                if(result){
                  this.subscription.unsubscribe();
                  this.snackBar.open('デバイスから応答がありませんでした', '閉じる', {duration: 7000});
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
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
