import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { card } from '../models/card';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { device } from '../models/device';

export interface viewDev {
  id: number,
  name: string,
  checked: boolean
}

@Component({
  selector: 'app-edit-card-dialog',
  templateUrl: './edit-card-dialog.component.html',
  styleUrls: ['./edit-card-dialog.component.scss']
})
export class EditCardDialogComponent implements OnInit {
  members: member[] = []; 
  card: card = {
    idm: '',
    id: 0,
    enable: true,
    expire: '',
    remark: '',
    banDevids: []
  }
  form!: FormGroup;
  idmControl = new FormControl(null, Validators.required);
  idControl = new FormControl(null, Validators.required);
  enableControl = new FormControl(true);
  remarkControl = new FormControl(null);
  banDevidsControl = new FormControl(null);
  viewDevs: viewDev[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public idm: string,
    private dbService: DbService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    console.log(this.viewDevs);
    this.getCard(this.idm);
    //this.getBanDevids();
    this.form = this.fb.group({
      idm: this.idmControl,
      id: this.idControl,
      enable: this.enableControl,
      remark: this.remarkControl,
      banDevids: this.banDevidsControl
    });
  }

  getCard(idm: string): void {
    this.dbService.get<card>('card', idm)
    .subscribe(card => {
      this.card = card;
      this.dbService.getAll<member>('members')
      .subscribe(members => {
        this.members = members;
        this.enableControl.setValue(this.card.enable);
        this.dbService.getAll<device>('devices')
        .subscribe(devices => {
          devices.forEach(device => {
            if(this.card.banDevids.includes(device.id)){
              this.viewDevs.push({
                id: device.id,
                name: device.name,
                checked: true
              });
            }
            else{
              this.viewDevs.push({
                id: device.id,
                name: device.name,
                checked: false
              });
            }
          });
          console.log(this.viewDevs);
        });
      });
    });
  }

  getBanDevids(): void {
    this.dbService.getAll<device>('devices')
    .subscribe(devices => {
      for(let device of devices){
        let checked: boolean = false;
        console.log(this.card.banDevids);
        if(this.card.banDevids.includes(device.id)){
          console.log(device.id);
          checked = true;
        }
        else{
          checked = false;
        }
        this.viewDevs.push({
          id: device.id,
          name: device.name,
          checked: checked
        });
      }
      console.log(this.viewDevs);
    });
  }

  onSave(): void {
    this.card.enable = this.form.get('enable')?.value;
    this.card.banDevids = this.viewDevs.filter(dev => dev.checked).map(el => el.id);
    this.dbService.update<card>('card', this.card)
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
