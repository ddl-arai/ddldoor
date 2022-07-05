import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../../../services/db.service';
import { user } from '../../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-delete',
  templateUrl: './account-delete.component.html',
  styleUrls: ['./account-delete.component.scss']
})
export class AccountDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AccountDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public email: string,
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dbService.delete<user>('user', this.email)
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
