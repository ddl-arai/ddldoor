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

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getMembers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
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
            status = 'アンチパスバック'
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
      width: '432px',
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
    });
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
          this.snackBar.open('APB解除しました', '閉じる', {duration: 5000});
          this.ngOnInit();
        }
        else{
          this.snackBar.open('APB解除できませんでした', '閉じる', {duration: 7000});
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
