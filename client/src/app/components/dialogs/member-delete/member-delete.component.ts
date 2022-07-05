import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbService } from '../../../services/db.service';
import { member } from '../../../models/member';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface dialogData {
  id: number,
  name: string
}

@Component({
  selector: 'app-member-delete',
  templateUrl: './member-delete.component.html',
  styleUrls: ['./member-delete.component.scss']
})
export class MemberDeleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MemberDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dbService.delete<member>('member', this.data.id)
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
