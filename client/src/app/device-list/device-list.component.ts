import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DbService } from '../db.service';
import { device } from '../models/device';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDialogComponent } from '../device-dialog/device-dialog.component';
import { EditDeviceDialogComponent } from '../edit-device-dialog/edit-device-dialog.component';
import { DeleteDeviceDialogComponent } from '../delete-device-dialog/delete-device-dialog.component';
import { MatSort } from '@angular/material/sort';
import { DeviceTmpopenDialogComponent } from '../device-tmpopen-dialog/device-tmpopen-dialog.component';
import { timer, Subscription } from 'rxjs';
import { SpinnerService } from '../spinner.service';

export interface displayData {
  id: number,
  name: string,
  role: string, // 入口 or 出口
  status: string,
  timeout: string
}

export interface counter {
  [key: string]: string
}

export interface openedDev {
  id: number,
  openStartTime: number,
  timeout: number
}

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'name',
    'role',
    'status',
    'tmpopen',
    'timeout',
    'action'
  ];
  dataSource = new MatTableDataSource<displayData>();
  usedIds: number[] = [];
  timer = timer(0, 1000);
  subscription: Subscription = new Subscription();
  timerLock = timer(0, 1000);
  subscriptionLock: Subscription = new Subscription();
  isAdmin: boolean = false;
  counters: counter = {};
  openedDevs: openedDev[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.usedIds = [];
    this.openedDevs = [];
    this.getDevices();
    this.getAdmin();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getDevices(): void {
    this.dbService.getAll<device>('devices')
    .subscribe(devices => {
      if(devices.length === 0){
        this.snackBar.open('データがありませんでした', '閉じる', {duration: 7000});
        return;
      }
      let displayDevices: displayData[] = [];
      devices.forEach(device => {
        let role: string = '';
        let status: string = '';
        let timeout: string = '';
        switch(device.func){
          case 'enter':
            role = '入口'
            break;
          case 'exit':
            role = '出口';
            break;
          default:
            break;
        }
        switch(device.status){
          case 0:
            status = '通常';
            break;
          case 1:
            status = '一時解錠中';
            if(device.openStartTime){
              this.openedDevs.push({
                id: device.id,
                openStartTime: device.openStartTime,
                timeout: device.timeout
              });
            }
            break;
          default:
            break;
        }
        switch(device.timeout){
          case (60 * 60 * 1000):
            timeout = '60分';
            break;
          case (30 * 60 * 1000):
            timeout = '30分';
            break;
          case (15 * 60 * 1000):
            timeout = '15分';
            break;
          case (15 * 1000):
            timeout = '15秒';
            break;
          default:
            break;
        }
        displayDevices.push({
          id: device.id,
          name: device.name,
          role: role,
          status: status,
          timeout: timeout
        });
        this.usedIds.push(device.id)
      });
      this.dataSource.data = displayDevices;
      this.startCountDown();
    })
  }

  getAdmin(): void {
    this.dbService.getUser()
    .subscribe(user => this.isAdmin = user.admin);
  }

  startCountDown(): void {
    this.subscription.unsubscribe();
    if(this.openedDevs.length !== 0){
      this.subscription = this.timer.subscribe(() => {
        //console.log('Active Subscription!');
        this.openedDevs.forEach(dev => {
          const msec = (dev.openStartTime + dev.timeout) - Date.now();
          if(msec > 0){
            let rest = new Date(msec);
            this.counters[`${dev.id}`] = `${rest.getMinutes()}:${('0' + String(rest.getSeconds())).slice(-2)}`;
          }
          else{
            this.onRefresh();    
          }
        });
      });
    }
  }

  onRefresh(): void {
    this.ngOnInit();
  }

  onRegister(): void {
    let dialogRef = this.dialog.open(DeviceDialogComponent, {
      width: '400px',
      data: this.usedIds
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });

  }

  onEdit(id: number): void {
    let dialogRef = this.dialog.open(EditDeviceDialogComponent, {
      width: '400px',
      data: id
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });

  }

  onDelete(id: number, name: string): void {
    let dialogRef = this.dialog.open(DeleteDeviceDialogComponent, {
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

  onLock(id: number, name: string): void {
    this.spinnerService.attach();
    let device: device = {
      id: id,
      name: name,
      func: '',
      status: 0,
      timeout: 0
    }
    this.dbService.update<device>('device/tmp', device)
    .subscribe(result => {
      if(result){
        this.subscriptionLock = this.timerLock.subscribe(count => {
          /* Get open status */
          this.dbService.get<device>('device', id)
          .subscribe(device => {
            let opened = device.open;
            if(opened === undefined){
              this.subscriptionLock.unsubscribe();
              this.snackBar.open('エラーが発生しました', '閉じる', {duration: 5000});
              return;
            }

            /* Closed */
            if(!opened){
              this.dbService.add<any>('log', {
                sec: Math.floor(Date.now() / 1000),
                devid: device.id,
                devName: device.name,
                result: 8
              })
              .subscribe(() => {
                this.subscriptionLock.unsubscribe();
                this.snackBar.open('施錠しました', '閉じる', {duration: 5000});
                this.spinnerService.detach();
                this.ngOnInit();
                return;
              });
            }

            /* Timeout */
            if(count > 5){
              device.status = 1;
              this.dbService.update<device>('device/tmp', device)
              .subscribe(result => {
                if(result){
                  this.subscriptionLock.unsubscribe();
                  this.snackBar.open('デバイスから応答がありませんでした', '閉じる', {duration: 7000});
                  this.spinnerService.detach();
                  this.ngOnInit();
                  return;
                }
                else{
                  this.subscription.unsubscribe();
                  this.snackBar.open('エラーが発生しました', '閉じる', {duration: 5000});
                }
              });
            }
          });
        });
      }
      else{
        this.snackBar.open('施錠できませんでした', '閉じる', {duration: 7000});
        this.spinnerService.detach();
        this.ngOnInit();
      }
    });
  }

  onTempOpen(id: number, name: string, timeout: string): void {
    let dialogRef = this.dialog.open(DeviceTmpopenDialogComponent, {
      width: '400px',
      data: {
        id: id,
        name: name,
        timeout: timeout
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscriptionLock.unsubscribe();
  }

}
