import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { log } from '../models/log';

export interface dialogData {
  start: string,
  end: string,
  noList: number[]
}

@Component({
  selector: 'app-delete-log-dialog',
  templateUrl: './delete-log-dialog.component.html',
  styleUrls: ['./delete-log-dialog.component.scss']
})
export class DeleteLogDialogComponent implements OnInit {
  info: string = '';

  constructor(
    public dialogRef: MatDialogRef<DeleteLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if(this.data.start && this.data.end){
      let start = new Date(this.data.start);
      let end = new Date(this.data.end);
      let start_str = `${start.getFullYear()}/${this.pad(start.getMonth() + 1)}/${this.pad(start.getDate())}`;
      let end_str = `${end.getFullYear()}/${this.pad(end.getMonth() + 1)}/${this.pad(end.getDate())}`
      this.info = `${start_str}から${end_str}まで`;
    }
    else if (!this.data.start && !this.data.end){
      this.info = '全て'
    }
  }

  pad(number: number): string {
    let str: string = `${('0' + String(number)).slice(-2)}`;
    return str;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dbService.deleteLogs(this.data.noList)
    .subscribe(result => {
      if(result){
        this.snackBar.open('削除しました', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('削除できませんでした', '閉じる', {duration: 7000});
      }
    })
  }

}
