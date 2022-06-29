import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { log } from '../models/log';
import { DbService } from '../db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerService } from '../spinner.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { fromEvent, map, Subscription, throttleTime, pairwise, distinctUntilChanged, share, filter } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';

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

export interface range {
  start: number,
  end: number
}

export interface options {
  fileName: string
}

const COLUMNS = [
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

const COLUMNS_FOR_MOBILE = [
  'date',
  'time',
  'name',
  'devName',
  'result'
];

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, AfterViewInit, OnDestroy {
  subscription = new Subscription();
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<displayData>();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  options: options = {
    fileName: ''
  }
  mobileTitle: boolean = false;
  scrollSubsc = new Subscription();
  logCounter: number = 0;
  reloading: boolean = false;
  displaylogs: displayData[] = [];
  logRange: range = { start: 0, end: 0 };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(CdkScrollable) cdkScrollable!: CdkScrollable;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: SpinnerService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.logRange = { start: 0, end: 0 };
    this.range.reset();
    this.initLogs();
    this.options.fileName = 'ddldoor_log';
    this.subscription.unsubscribe();
    this.subscription = this.breakpointObserver.observe(Breakpoints.Handset)
    .subscribe(result => {
      if(result.matches){
        this.displayedColumns = COLUMNS_FOR_MOBILE;
        this.mobileTitle = true;
      }
      else{
        this.displayedColumns = COLUMNS;
        this.mobileTitle = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const content = document.querySelector('.mat-sidenav-content');
    if(!content){
      this.snackBar.open('オートリロードエラー', '閉じる', {duration: 7000});
      return;
    }
    const scroll = fromEvent(content, 'scroll').pipe(
      throttleTime(10), // only emit every 10 ms
      map(() => (content.scrollHeight - window.innerHeight) * 0.8 < content.scrollTop ? true : false),
      share(),
    );
    this.scrollSubsc = scroll.subscribe(result => {
      if(result && !this.reloading){
        //console.log('reload! logCounter: ' + this.logCounter);
        this.getLogs();
      }
    });
  }

  initLogs(): void {
    this.displaylogs = [];
    this.reloading = false;
    this.getLogsLen();
  }

  getLogsLen(): void {
    this.dbService.get<number>('logs', `len/${this.logRange.start}/${this.logRange.end}`)
    .subscribe(result => {
      if(result === 0){
        this.snackBar.open('データがありませんでした', '閉じる', {duration: 5000});
        return;
      }
      this.logCounter = result;
      this.getLogs();
    });
  }

  getLogs(): void {
    this.reloading = true;
    //this.spinnerService.attach();
    this.dbService.getAll<log>(`logs/${this.logCounter}/${this.logRange.start}/${this.logRange.end}`)
    .subscribe(logs => {
      if(logs.length === 0){
        this.snackBar.open('全てのデータをロードしました', '閉じる', {duration: 5000});
        this.spinnerService.detach();
        return;
      }
      this.logCounter = logs[logs.length - 1].no! - 1;
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
            result = '不正リクエスト';
            break;
          case 10:
            result = '無許可IDm';
            break;
          case 11:
            result = '手動打刻';
            break;
          case 12:
            result = 'ゲストタッチOK';
            break;
          default:
            break;
        }

        this.displaylogs.push({
          no: log.no!,
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
      this.dataSource.data = this.displaylogs;
      this.spinnerService.detach();
      this.reloading = false;
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
    if(!this.range.value['start']){
      this.snackBar.open('日付を選択してください', '閉じる', {duration: 7000});
      return;
    }
    let start = new Date(this.range.value['start']);
    let end = !this.range.value['end'] ? start : new Date(this.range.value['end']);

    this.logRange.start = start.getTime() / 1000;
    this.logRange.end = ((end.getTime() / 1000) + 24 * 60 * 60) - 1;
    this.initLogs();
 
    let start_str = `${start.getFullYear()}-${this.pad(start.getMonth() + 1)}-${this.pad(start.getDate())}`;
    let end_str = `${end.getFullYear()}-${this.pad(end.getMonth() + 1)}-${this.pad(end.getDate())}`
    this.options.fileName += start_str !== end_str ? `(${start_str}_${end_str})` : `(${start_str})`;
  }

  onCSVStart(): void {
    this.spinnerService.attach();
  }

  onCSVFinish(): void {
    this.spinnerService.detach();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.scrollSubsc.unsubscribe();
  }

}
