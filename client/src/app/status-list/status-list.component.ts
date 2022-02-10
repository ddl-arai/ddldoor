import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { member } from '../models/member';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface displayData {
  id: number,
  content: string
}

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss']
})
export class StatusListComponent implements OnInit {
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


  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMembers();
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
        if(member.initial){
          displayedMembersIni.push({
            id: member.id,
            content: `${member.name}さんは初期状態となっています`
          });
        }
        else{
          if(member.attendance){
            displayedMembersAtt.push({
              id: member.id,
              content: member.name
            });
          }
          else{
            displayedMembersAbs.push({
              id: member.id,
              content: member.name
            });
          }
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