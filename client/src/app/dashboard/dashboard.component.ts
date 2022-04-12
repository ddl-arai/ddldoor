import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DbService } from '../db.service';
import { timer, Subscription } from 'rxjs';
import { member } from '../models/member';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface status {
  id: number,
  name: string,
  status: number
}

export interface monitor {
  no: number,
  info: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  members: member[] = [];
  timer = timer(0, 1000);
  subscription = new Subscription();
  others: member[] = [];
  exists: member[] = [];
  absences: member[] = [];
  apbs: member[] = [];
  logs: monitor[] = [];
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          //{ id: 1, title: '在室者', cols: 2, rows: 1 },
          { id: 2, title: 'アンチパスバック', cols: 2, rows: 1 },
          //{ id: 3, title: '直近のログ', cols: 2, rows: 1 },
          //{ title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { id: 1, title: '在外状況', cols: 2, rows: 1 },
        { id: 2, title: 'アンチパスバック', cols: 1, rows: 1 },
        { id: 3, title: '直近のログ', cols: 1, rows: 1 },
        //{ title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dbService: DbService,
    private snackBar: MatSnackBar
    ) {}

  ngOnInit(): void {
    this.startGetMembers();
  }

  onStatisticRefresh(): void {
    
  }

  startGetMembers(): void {
    this.subscription = this.timer.subscribe(() => {
      this.getMembers();
      this.getLogs();
    });
  }

  getMembers(): void {
    this.dbService.getAll<member>('members')
    /*.pipe(first())*/.subscribe(members => {
      this.members = members;
      this.others = this.members.filter(el => el.status === 0 || el.status === 3 || el.status === 4);
      this.exists = this.members.filter(el => el.status === 1);
      this.absences = this.members.filter(el => el.status === 2);
      this.apbs = this.others.filter(el => el.status === 3);
    });
  }

  getLogs(): void {
    this.dbService.getLogs(8)
    .subscribe(logs => {
      let bufLogs: monitor[] = [];
      for(let log of logs){
        switch(log.result){
          case 0:
            bufLogs.push({
              no: log.no!,
              info: `${log.name}さんが${log.devName}にタッチしました`
            });
            break;
          case 1:
            bufLogs.push({
              no: log.no!,
              info: `${log.name}さんが${log.devName}でAPBになりました`
            });
            break;
          default:
            bufLogs.push({
              no: log.no!,
              info: '通常の打刻以外のイベントが発生しました'
            });
            break;
        }
      }
      this.logs = bufLogs.sort((x,y) => y.no - x.no)
    })
  }

  onReset(id: number): void {
    this.dbService.get<member>('member', id)
    .subscribe(member => {
      member.status = 0;
      this.dbService.update<member>('member', member)
      .subscribe(result => {
        if(result){
          this.snackBar.open('初期状態にしました', '閉じる', {duration: 5000});
        }
        else{
          this.snackBar.open('初期状態にできませんでした', '閉じる', {duration: 7000});
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
