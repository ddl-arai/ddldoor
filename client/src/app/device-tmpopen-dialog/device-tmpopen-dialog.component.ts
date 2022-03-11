import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { device } from '../models/device';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface dialogData {
  id: number,
  name: string
}

@Component({
  selector: 'app-device-tmpopen-dialog',
  templateUrl: './device-tmpopen-dialog.component.html',
  styleUrls: ['./device-tmpopen-dialog.component.scss']
})
export class DeviceTmpopenDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeviceTmpopenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onTmpOpen(): void {
    let device: device = {
      id: this.data.id,
      name: '',
      func: '',
      status: 1
    }
    this.dbService.update<device>('device/tmp', device)
    .subscribe(result => {
      if(result){
        this.snackBar.open('一時解錠しました', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('一時解錠できませんでした', '閉じる', {duration: 7000});
      }
    })
  }

}
