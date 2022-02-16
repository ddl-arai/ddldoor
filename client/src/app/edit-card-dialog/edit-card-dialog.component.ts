import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { card } from '../models/card';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    remark: ''
  }
  form!: FormGroup;
  idmControl = new FormControl(null, Validators.required);
  idControl = new FormControl(null, Validators.required);
  enableControl = new FormControl(true);
  remarkControl = new FormControl(null);


  constructor(
    public dialogRef: MatDialogRef<EditCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public idm: string,
    private dbService: DbService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getCard(this.idm);
    this.form = this.fb.group({
      idm: this.idmControl,
      id: this.idControl,
      enable: this.enableControl,
      remark: this.remarkControl,
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
      })
    })
  }

  onSave(): void {
    this.card.enable = this.form.get('enable')?.value;
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
