import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { member } from '../models/member';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-member-dialog',
  templateUrl: './member-dialog.component.html',
  styleUrls: ['./member-dialog.component.scss']
})
export class MemberDialogComponent implements OnInit {
  member: member = {
    id: 0,
    name: '',
    lastname: '',
    firstname: '',
    company: '',
    enable: true,
    status: 0
  }
  idOptions: number[] = [...Array(100).keys()].map(i => ++i);

  form!: FormGroup;
  idControl = new FormControl(null, Validators.required);
  nameControl = new FormControl(null, Validators.required);
  lastnameControl = new FormControl(null);
  firstnameControl = new FormControl(null);
  companyControl = new FormControl(null);
  enableControl = new FormControl(true);

  constructor(
    public dialogRef: MatDialogRef<MemberDialogComponent>,
    private fb: FormBuilder,
    private dbService: DbService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public usedIds: number[]
  ) { }

  ngOnInit(): void {
    this.idOptions = this.idOptions.filter(i => !this.usedIds.includes(i));
    this.form = this.fb.group({
      id: this.idControl,
      name: this.nameControl,
      lastname: this.lastnameControl,
      firstname: this.firstnameControl,
      company: this.companyControl,
      enable: this.enableControl
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.member.id = this.form.get('id')?.value;
    this.member.name = this.form.get('name')?.value;
    this.member.lastname = this.form.get('lastname')?.value;
    this.member.firstname = this.form.get('firstname')?.value;
    this.member.company = this.form.get('company')?.value;
    this.member.enable = this.form.get('enable')?.value;
    this.dbService.add<member>('member', this.member)
    .subscribe(result => {
      if(result){
        this.snackBar.open('登録しました', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('登録できませんでした', '閉じる', {duration: 7000});
      }
    })
  }

}
