import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

export interface displayData {
  id: number,
  content: string
}

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss']
})
export class StatusListComponent implements OnInit, AfterViewInit {
  displayedColumnsIni: string[] = [
    'id',
    'content'
  ];
  dataSourceIni = new MatTableDataSource<displayData>();
  displayedColumnsAtt: string[] = [
    'id',
    'name'
  ];
  dataSourceAtt = new MatTableDataSource<displayData>();
  displayedColumnsAbs: string[] = [
    'id',
    'name'
  ];
  dataSourceAbs = new MatTableDataSource<displayData>();

  @ViewChild(MatSort) sortAtt!: MatSort;
  @ViewChild(MatSort) sortAbs!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMembers();
  }

  ngAfterViewInit(): void {
    this.dataSourceAtt.sort = this.sortAtt;
    this.dataSourceAbs.sort = this.sortAbs;
  }

  getMembers(): void {
    this.dbService.getAll<member>('members')
    .subscribe(members=> {
      if(members.length === 0){
        this.snackBar.open('データがありませんでした', '閉じる', {duration: 7000});
        return;
      }
      let displayedMembersIni: displayData[] = [];
      let displayedMembersAtt: displayData[] = [];
      let displayedMembersAbs: displayData[] = [];
      members.forEach(member => {
        switch(member.status){
          case 0:
            displayedMembersIni.push({
              id: member.id,
              content: `${member.name}さんは初期状態となっています`
            });
            break;
          case 1:
            displayedMembersAtt.push({
              id: member.id,
              content: member.name
            });
            break;
          case 2:
            displayedMembersAbs.push({
              id: member.id,
              content: member.name
            });
            break;
          case 3:
            displayedMembersIni.push({
              id: member.id,
              content: `${member.name}さんはアンチパスバックとなっています`
            });
            break;
          default:
            break;
        }
      });
      this.dataSourceIni.data = displayedMembersIni;
      this.dataSourceAtt.data = displayedMembersAtt;
      this.dataSourceAbs.data = displayedMembersAbs;
    });
  }

  onRefresh(): void {
    this.ngOnInit();
  }
}
