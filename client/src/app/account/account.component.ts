import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DbService } from '../db.service';
import { user } from '../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteLogDialogComponent } from '../delete-log-dialog/delete-log-dialog.component';
import { holiday } from '../models/holiday';

export interface viewHoliday {
  view: string,
  date: string,
  remark: string
}

export interface displayData {
  email: string,
  admin: boolean
}

export interface selectedData {
  date: string,
  remark: string
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user: user = {
    email: '',
    password: '',
    admin: false
  }
  email: string = '';
  form!: FormGroup;
  emailControl = new FormControl(null, [
    Validators.required,
    Validators.email
  ]);
  adminControl = new FormControl(null);
  success: boolean = false;
  checked: boolean = false;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  selectedData: selectedData = {date: '', remark: ''};
  viewHolidays: viewHoliday[] = [];

  displayedColumns: string[] = [
    'email',
    'admin',
    'action'
  ];
  dataSource = new MatTableDataSource<displayData>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dbService: DbService,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.viewHolidays = [];
    this.selectedData = {date: '', remark: ''};
    this.getUser();
    this.getUsers();
    this.getHolidays();
    this.form = this.fb.group({
      email: this.emailControl,
      admin: this.adminControl
    });
  }

  onResetPW(): void {
    this.dbService.resetPW()
    .subscribe(token => {
      this.authService.logout()
      .subscribe(() => {
        this.router.navigate([`/reset/${token}`]);
      });
    });
  }

  onGenAccount(): void {
    this.user.email = this.form.get('email')?.value; 
    this.authService.genPW()
    .subscribe(password => {
      if(password){
        this.user.password = password;
        this.dbService.exist('user', this.user.email)
        .subscribe(exist => {
          if(exist){
            this.success = false;
            this.snackBar.open('このアドレスは既に登録済みです', '閉じる', { duration: 7000 });
          }
          else{
            this.dbService.createUser(this.user)
            .subscribe(result => {
              if(!result){
                this.success = false;
                this.snackBar.open('アカウントを発行できませんでした', '閉じる', { duration: 7000 });
              }
              else{
                this.success = true;
                this.snackBar.open('アカウントを発行しました', '閉じる', { duration: 5000 });
                this.ngOnInit();
              }
            });
          }
        });
      }
    });
  }

  onCopy(): void {
    this.clipboard.copy(this.user.password);
    this.snackBar.open('コピーしました', '閉じる', { duration: 4000 });
  }

  getUsers(): void {
    this.dbService.getAll<user>('users')
    .subscribe(users => {
      let displayUsers: displayData[] = [];
      users.forEach(user => {
        displayUsers.push({
          email: user.email,
          admin: user.admin
        });
      });
      this.dataSource.data = displayUsers;
    });
  }

  getUser(): void {
    this.dbService.getUser()
    .subscribe(user => this.email = user.email);
  }

  onDelete(email: string): void {
		let dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
		  width: '400px',
		  data: email
		});
		dialogRef.afterClosed().subscribe(() => {
		  this.ngOnInit();
		});
	}

  onZaru(): void {
    this.dbService.modeChange('zaru')
    .subscribe(result => {
      if(result){
        this.snackBar.open('状態管理なしモードにしました', '閉じる', { duration: 5000 });
      }
      else{
        this.snackBar.open('モード変更できませんでした', '閉じる', { duration: 7000 });
      }
    });
  }

  onDeleteLog(): void {
    if(!((this.range.value['start'] && this.range.value['end']) || (!this.range.value['start'] && !this.range.value['end']))){
      
      this.snackBar.open('正しい範囲を入力してください', '閉じる', {duration: 7000});
      return;
    }
    let dialogRef = this.dialog.open(DeleteLogDialogComponent, {
      width: '480px',
      data: { 
        start: this.range.value['start'],
        end: this.range.value['end']
      }
    });
    dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
    });
  }

  getHolidays(): void {
    this.dbService.getAll<holiday>('holidays')
    .subscribe(holidays => {
      holidays.forEach(holiday => {
        let date = new Date(Number(holiday.date));
        this.viewHolidays.push({
          view: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${holiday.remark}`,
          date: holiday.date,
          remark: holiday.remark
        });
      });
      this.viewHolidays.sort((x, y) => Number(x.date) - Number(y.date));
    });
  }

  onRemove(date: string){
    this.dbService.delete('holiday', date)
    .subscribe(result => {
      if(result){
        this.ngOnInit();
        //this.viewHolidays = this.viewHolidays.filter(el => el.date !== date);
      }
      else{
        this.snackBar.open('削除できませんでした', '閉じる', {duration: 7000});
        //this.ngOnInit();
      }
    });
  }

  onAdd(): void {
    if(!this.selectedData.date){
      this.snackBar.open('日付を入力してください', '閉じる', {duration: 7000});
      return;
    }
    if(this.isDup()){
      this.snackBar.open('その日付は既に追加されています', '閉じる', {duration: 7000});
    }
    else{
      let body: holiday = {
        date: String(new Date(this.selectedData.date).getTime()),
        remark: this.selectedData.remark
      }
      this.dbService.add<holiday>('holiday', body)
      .subscribe(result => {
        if(result){
          this.snackBar.open('追加しました', '閉じる', {duration: 5000});
          this.ngOnInit();
        }
        else{
          this.snackBar.open('追加できませんでした', '閉じる', {duration: 7000});
        }
      });
    }
  }

  isDup(): boolean {
    const selected = new Date(this.selectedData.date);
    for(let d of this.viewHolidays){
      const date = new Date(Number(d.date));
      if(date.getFullYear() === selected.getFullYear() && date.getMonth() === selected.getMonth() && date.getDate() === selected.getDate()){
        return true;
      }
    }
    return false;
  }

}
