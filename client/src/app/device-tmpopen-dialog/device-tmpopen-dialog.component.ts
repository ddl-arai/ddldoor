import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { device } from '../models/device';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    this.dialogRef.close(false);
  }

  onTmpOpen(): void {
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
        this.dialogRef.close(true);
      }
      else{
        this.snackBar.open('一時解錠できませんでした', '閉じる', {duration: 7000});
      }
    })
  }

}
