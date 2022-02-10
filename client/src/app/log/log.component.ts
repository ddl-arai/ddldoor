import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { log } from '../models/log';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface displayData {
  no: number,
  date: string,
  time: string,
  idm: string,
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, AfterViewInit{
  displayedColumns: string[] = [
    'no',
    'date',
    'time',
    'idm',
  ];
  dataSource = new MatTableDataSource<displayData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getLogs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getLogs(): void {
    this.dbService.getAll<log>('logs')
    .subscribe(logs => {
      if(logs.length === 0){
        this.snackBar.open('データがありませんでした', '閉じる', {duration: 7000});
        return;
      }
      let displaylogs: displayData[] = [];
      logs.forEach(log => {
        displaylogs.push(log);
      });
      this.dataSource.data = displaylogs;
    })
  }

  onRefresh(): void {
    this.ngOnInit();
  }

  onCSVExport(): void {

  }

}
