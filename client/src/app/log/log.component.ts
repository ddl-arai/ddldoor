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
        let time = new Date(log.ms);
        displaylogs.push({
          no: log.no,
          date: `${time.getFullYear()}/${this.pad(time.getMonth() + 1)}/${this.pad(time.getDate())}`,
          time: `${this.pad(time.getHours())}:${this.pad(time.getMinutes())}:${this.pad(time.getSeconds())}`,
          idm: log.idm,
        });
      });
      this.dataSource.data = displaylogs;
    })
  }

  onRefresh(): void {
    this.ngOnInit();
  }

  onCSVExport(): void {

  }

  pad(number: number): string {
    let str: string = `${('0' + String(number)).slice(-2)}`;
    console.log(str);
    return str;
  }

}
