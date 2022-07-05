import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../../../services/db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from '../../../services/spinner.service';

export interface dialogData {
  start: string,
  end: string
}

@Component({
  selector: 'app-account-log-delete',
  templateUrl: './account-log-delete.component.html',
  styleUrls: ['./account-log-delete.component.scss']
})
export class AccountLogDeleteComponent implements OnInit {
  dulation: string = '';
  inputted: string = '';
  confirmed: string = 'のログを削除します';
  

  constructor(
    public dialogRef: MatDialogRef<AccountLogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private dbService: DbService,
    private snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    if(!this.data.start && !this.data.end){
      this.dulation = '全て';
    }
    else{
      let start = new Date(this.data.start);
      let end = new Date(this.data.end);
      let start_str = `${start.getFullYear()}/${this.pad(start.getMonth() + 1)}/${this.pad(start.getDate())}`;
      let end_str = `${end.getFullYear()}/${this.pad(end.getMonth() + 1)}/${this.pad(end.getDate())}`
      this.dulation = `${start_str}から${end_str}まで`;
    }
    this.confirmed = this.dulation + this.confirmed;
  }

  pad(number: number): string {
    let str: string = `${('0' + String(number)).slice(-2)}`;
    return str;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.spinnerService.attach();
    this.dbService.deleteLogs(new Date(this.data.start).getTime(), new Date(this.data.end).getTime())
    .subscribe(deleted => {
      if(deleted > 0){
        this.snackBar.open(`${deleted}件、削除しました`, '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else if(deleted === 0){
        this.snackBar.open('対象範囲にログはありませんでした', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('削除できませんでした', '閉じる', {duration: 7000});
      }
      this.spinnerService.detach();
    });
  }

}
