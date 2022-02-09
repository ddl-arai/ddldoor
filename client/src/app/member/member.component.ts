import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MemberDialogComponent } from '../member-dialog/member-dialog.component';
import { EditMemberDialogComponent } from '../edit-member-dialog/edit-member-dialog.component';


export interface displayData {
  id: number,
  name: string,
  lastname: string,
  firstname: string,
  company: string
  status: string  // 在室 or 外室
}


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  members: member[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'lastname',
    'firstname',
    'company',
    'status',
    'edit'
  ];
  dataSource = new MatTableDataSource<displayData>();
  usedIds: number[] = [];

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(): void {
    this.dbService.getAll<member>('members')
    .subscribe(members => {
      if(members.length === 0){
        this.snackBar.open('データがありませんでした', '閉じる', {duration: 7000});
        return;
      }
      let displayMembers: displayData[] = [];
      members.forEach(member => {
        let status: string;
        if(member.attendance === true){
          status = '在室';
        }
        else{
          status = '外室';
        }
        displayMembers.push({
          id: member.id,
          name: member.name,
          lastname: member.lastname,
          firstname: member.firstname,
          company: member.company,
          status: status
        });
        this.usedIds.push(member.id);
      });
      this.dataSource.data = displayMembers;
    });
  }

  onRegister(): void {
    let dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '400px',
      data: this.usedIds
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  onEdit(id: number): void {
    let dialogRef = this.dialog.open(EditMemberDialogComponent, {
      width: '400px',
      data: id
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    })
  }
}
