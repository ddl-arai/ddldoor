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
  result: string
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
    'result'
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
        let result: string = '';
        switch(log.prevStat){
          case 0:
            prevStat = '初期状態';
            break;
          case 1:
            prevStat = '在室';
            break;
          case 2:
            prevStat = '外室';
            break;
          case 3:
            prevStat = 'アンチパスバック'
            break;
          case 4:
            prevStat = '状態管理なし'
            break;
          default:
            break;
        }
        switch(log.result){
          case 0:
            result = '通常タッチOK';
            break;
          case 1:
            result = 'アンチパスバックエラー';
            break;
          case 2:
            result = '未登録IDm';
            break;
          case 3:
            result = '未登録デバイス';
            break;
          case 4:
            result = '未登録IDm&デバイス';
            break;
          case 5:
            result = '無効IDm';
            break;
          case 6:
            result = '無効メンバー';
            break;
          default:
            break;
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
          result: result
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
    const start = new Date(this.range.value['start']);
    const end = new Date(this.range.value['end']);
    this.dataSource.data = this.dataSource.data.filter(element => new Date(element.date) >= start && new Date(element.date) <= end);
    const start_str = `${start.getFullYear()}-${this.pad(start.getMonth() + 1)}-${this.pad(start.getDate())}`;
    const end_str = `${end.getFullYear()}-${this.pad(end.getMonth() + 1)}-${this.pad(end.getDate())}`
    this.options.fileName += `(${start_str}_${end_str})`;
    this.snackBar.open('フィルタリングしました', '閉じる', {duration: 5000});
  }

}
