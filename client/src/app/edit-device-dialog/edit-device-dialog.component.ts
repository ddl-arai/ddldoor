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
    status: 0
  }
  form!: FormGroup;
  idControl = new FormControl(null, Validators.required);
  nameControl = new FormControl(null, Validators.required);
  funcControl = new FormControl(null, Validators.required);
  funcList: viewFunc[] = [
    {view: '入口', value: 'enter'},
    {view: '出口', value: 'exit'}
  ];

  constructor(
    public dialogRef: MatDialogRef<EditDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number,
    private dbService: DbService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getDevice(this.id);
    this.form = this.fb.group({
      id: this.idControl,
      name: this.nameControl,
      func: this.funcControl
    });
  }

  getDevice(id: number): void {
    this.dbService.get<device>('device', id)
    .subscribe(device => {
      this.device = device;
      this.funcControl.setValue(this.device.func);
    });
  }

  onSave(): void {
    this.device.func = this.form.get('func')?.value;
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
