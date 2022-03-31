import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from '../models/user';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface option {
  view: string,
  id: number
}

@Component({
  selector: 'app-navi-set-member',
  templateUrl: './navi-set-member.component.html',
  styleUrls: ['./navi-set-member.component.scss']
})
export class NaviSetMemberComponent implements OnInit {
  options: option[] = [];
  selectedId: number = 0;
  name: string = '';

  constructor(
    public dialogRef: MatDialogRef<NaviSetMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public user: user,
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    this.dbService.getAll<member>('members')
    .subscribe(members => {
      members.forEach(member => {
        if(this.user.associated_member_id){
          if(this.user.associated_member_id === member.id){
            this.name = member.name;
          }
        }
        this.options.push({
          view: member.name,
          id: member.id
        });
      });
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSetMember(): void {
    if(this.selectedId === 0){
      this.snackBar.open('メンバーを選択してください', '閉じる', {duration: 7000});
      return;
    }
    this.dbService.setMember(this.selectedId)
    .subscribe(response => {
      if(response.result === 0){
        this.snackBar.open('紐づけました', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else if(response.result === 1){
        this.snackBar.open('このメンバーは既に他のアカウントに紐づけられています', '閉じる', {duration: 7000});
      }
      else{
        this.snackBar.open('エラーが発生しました', '閉じる', {duration: 7000});
        this.ngOnInit();
      }
    })
  }

  onReleaseMember(): void {
    this.dbService.releaseMember()
    .subscribe(result => {
      if(result){
        this.snackBar.open('解除しました', '閉じる', {duration: 5000});
        this.dialogRef.close();
      }
      else{
        this.snackBar.open('エラーが発生しました', '閉じる', {duration: 7000});
        this.ngOnInit();
      }
    })

  }

}
