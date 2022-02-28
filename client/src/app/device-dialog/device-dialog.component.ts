import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { device } from '../models/device';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface viewFunc {
  view: string,
  value: string
}

@Component({
  selector: 'app-device-dialog',
  templateUrl: './device-dialog.component.html',
  styleUrls: ['./device-dialog.component.scss']
})
export class DeviceDialogComponent implements OnInit {
  device: device = {
    id: 0,
    name: '',
    func: '',
    status: 0
  }
  idOptions: number[] = [...Array(100).keys()].map(i => ++i);
  form!: FormGroup;
  idControl = new FormControl(null, Validators.required);
  nameControl = new FormControl(null, Validators.required);
  funcControl = new FormControl(null, Validators.required);
  funcList: viewFunc[] = [
    {view: '入口', value: 'enter'},
    {view: '出口', value: 'exit'}
  ];

  constructor(
    public dialogRef: MatDialogRef<DeviceDialogComponent>,
    private fb: FormBuilder,
    private dbService: DbService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public usedIds: number[]
  ) { }

  ngOnInit(): void {
    this.idOptions = this.idOptions.filter(i => this.usedIds.indexOf(i) === -1);
    this.form = this.fb.group({
      id: this.idControl,
      name: this.nameControl,
      func: this.funcControl
    });
  }

  onSubmit(): void {
    this.device.id = this.form.get('id')?.value;
    this.device.name = this.form.get('name')?.value;
    this.device.func = this.form.get('func')?.value;
    this.dbService.add<device>('device', this.device)
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
