import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  id: number,
  usedIds: number[]
}

@Component({
  selector: 'app-edit-member-dialog',
  templateUrl: './edit-member-dialog.component.html',
  styleUrls: ['./edit-member-dialog.component.scss']
})
export class EditMemberDialogComponent implements OnInit {
  member: member = {
    id: 0,
    name: '',
    lastname: '',
    firstname: '',
    company: '',
    attendance: false
  }
  idOptions: number[] = [...Array(100).keys()].map(i => ++i);
  form!: FormGroup;
  idControl = new FormControl(null, Validators.required);
  nameControl = new FormControl(null, Validators.required);
  lastnameControl = new FormControl(null);
  firstnameControl = new FormControl(null);
  companyControl = new FormControl(null);

  constructor(
    public dialogRef: MatDialogRef<EditMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dbService: DbService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.data.usedIds.push(this.data.id);
    this.idOptions = this.idOptions.filter(i => this.data.usedIds.indexOf(i) === -1);
    this.getMember(this.data.id);
    this.form = this.fb.group({
      id: this.idControl,
      name: this.nameControl,
      lastname: this.lastnameControl,
      firstname: this.firstnameControl,
      company: this.companyControl
    });
  }

  getMember(id: number): void {
    this.dbService.get<member>('member', id)
    .subscribe(member => this.member = member)
  }

  onSave(): void {
    /* --- Test Begin ---- */
    this.member.id = this.data.id;
    /* --- Test End --- */
    this.dbService.update<member>('member', this.member)
    .subscribe(result => {
      if(result){
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