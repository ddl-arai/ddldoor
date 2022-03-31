import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MemberDialogComponent } from '../member-dialog/member-dialog.component';
import { EditMemberDialogComponent } from '../edit-member-dialog/edit-member-dialog.component';
import { DeleteMemberDialogComponent } from '../delete-member-dialog/delete-member-dialog.component';
import { MatSort } from '@angular/material/sort';
import { StampDialogComponent } from '../stamp-dialog/stamp-dialog.component';
import { user } from '../models/user';


export interface displayData {
  id: number,
  name: string,
  lastname: string,
  firstname: string,
  company: string,
  enable: string, // 有効 or 無効
  status: string  // 在室, 外室, 初期状態 or アンチパスバック
}


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit, AfterViewInit{
  //members: member[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'lastname',
    'firstname',
    'company',
    'enable',
    'status',
    'action'
  ];
  dataSource = new MatTableDataSource<displayData>();
  usedIds: number[] = [];
  user: user = {
    email: '',
    password: '',
    admin: false,
    associated_member_id: 0
  }

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.usedIds = [];
    this.getMembers();
    this.getUser();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getUser(): void {
    this.dbService.getUser()
    .subscribe(user => this.user = user);
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
        let enable: string;
        let status: string;
        if(member.enable){
          enable = '有効';
        }
        else{
          enable = '無効';
        }
        switch(member.status){
          case 1:
            status = '在室';
            break;
          case 2:
            status = '外室';
            break;
          case 3:
            status = 'アンチパスバック';
            break;
          case 4:
            status = '状態管理なし';
            break;
          default:
            status = '初期状態';
            break;
        }
        displayMembers.push({
          id: member.id,
          name: member.name,
          lastname: member.lastname,
          firstname: member.firstname,
          company: member.company,
          enable: enable,
          status: status
        });
        this.usedIds.push(member.id);
      });
      this.dataSource.data = displayMembers;
    });
  }

  onRegister(): void {
    let dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '424px',
      data: this.usedIds
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  onEdit(id: number): void {
    let dialogRef = this.dialog.open(EditMemberDialogComponent, {
      width: '424px',
      data: id
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  onStamp(id: number, name: string): void {
    let dialogRef = this.dialog.open(StampDialogComponent, {
      width: '400px',
      data: {
        id: id,
        name: name
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    })
  }

  onRefresh(): void {
    this.ngOnInit();
  }

  onReset(id: number): void {
    this.dbService.get<member>('member', id)
    .subscribe(member => {
      member.status = 0;
      this.dbService.update<member>('member', member)
      .subscribe(result => {
        if(result){
          this.snackBar.open('初期状態にしました', '閉じる', {duration: 5000});
          this.ngOnInit();
        }
        else{
          this.snackBar.open('初期状態にできませんでした', '閉じる', {duration: 7000});
        }
      });
    });
  }

  onDelete(id: number, name: string): void {
    let dialogRef = this.dialog.open(DeleteMemberDialogComponent, {
      width: '400px',
      data: {
        id: id, 
        name: name
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
}
