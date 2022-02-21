import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { log } from '../models/log';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';

export interface displayData {
  no: number,
  date: string,
  time: string,
  idm: string,
  id: number,
  name: string,
  devName: string,
  prevStat: string,
  success: string
}

export interface options {
  fileName: string
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
    'id',
    'name',
    'devName',
    'prevStat',
    'success'
  ];
  dataSource = new MatTableDataSource<displayData>();

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  options: options = {
    fileName: ''
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getLogs();
    this.range.reset();
    this.options.fileName = 'ddldoor_log';
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
        let time = new Date(log.sec * 1000);
        let prevStat: string = '';
        let success: string = '';
        switch(log.prevStat){
          case 1:
            prevStat = '在室';
            break;
          case 2:
            prevStat = '外室';
            break;
          case 3:
            prevStat = 'アンチパスバック'
            break;
          default:
            prevStat = '初期状態';
            break;
        }
        if(log.success){
          success = '通常タッチOK';
        }
        else{
          success = 'アンチパスバックエラー'
        }

        displaylogs.push({
          no: log.no,
          date: `${time.getFullYear()}/${this.pad(time.getMonth() + 1)}/${this.pad(time.getDate())}`,
          time: `${this.pad(time.getHours())}:${this.pad(time.getMinutes())}:${this.pad(time.getSeconds())}`,
          idm: log.idm,
          id: log.id,
          name: log.name,
          devName: log.devName,
          prevStat: prevStat,
          success: success
        });
      });
      this.dataSource.data = displaylogs;
    });
  }

  onRefresh(): void {
    this.ngOnInit();
  }

  pad(number: number): string {
    let str: string = `${('0' + String(number)).slice(-2)}`;
    return str;
  }

  onFilter(): void {
    this.dataSource.data = this.dataSource.data.filter(element => new Date(element.date) >= this.range.value['start'] && new Date(element.date) <= this.range.value['end']);
    this.options.fileName += `${this.range.value['start']}_${this.range.value['end']}`;
  }

}
