import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { log } from '../models/log';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { DeleteLogDialogComponent } from '../delete-log-dialog/delete-log-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  admin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getLogs();
    this.range.reset();
    this.options.fileName = 'ddldoor_log';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUser(): void {
    this.dbService.getUser()
    .subscribe(user => this.admin = user.admin);
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
          case 7:
            result = '一時解錠';
            break;
          case 8:
            result = '施錠';
            break;
          case 9:
            result = '不正なリクエスト';
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
    let start = new Date(this.range.value['start']);
    if(!this.range.value['end']){
      this.snackBar.open('範囲を指定してください', '閉じる', {duration: 7000});
      this.onRefresh();
      return;
    }
    let end = new Date(this.range.value['end']);
    this.dataSource.data = this.dataSource.data.filter(el => new Date(el.date) >= start && new Date(el.date) <= end);
    let start_str = `${start.getFullYear()}-${this.pad(start.getMonth() + 1)}-${this.pad(start.getDate())}`;
    let end_str = `${end.getFullYear()}-${this.pad(end.getMonth() + 1)}-${this.pad(end.getDate())}`
    this.options.fileName += `(${start_str}_${end_str})`;
    this.snackBar.open('フィルタリングしました', '閉じる', {duration: 5000});
  }

  onDelete(): void {
    let noList: number[] = [];
    this.dataSource.data.forEach(el => {
      noList.push(el.no);
    });
    let dialogRef = this.dialog.open(DeleteLogDialogComponent, {
      width: '416px',
      data: { 
        start: this.range.value['start'],
        end: this.range.value['end'],
        noList: noList
      }
    });
    dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
    });
  }

}
