import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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

export interface displayData {
  id: number,
  name: string,
  role: string, // 入口 or 出口
  status: string
}


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'role',
    'status',
    'tmpopen',
    'action'
  ];
  dataSource = new MatTableDataSource<displayData>();
  usedIds: number[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.usedIds = [];
    this.getDevices();
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
            break;
          default:
            break;
        }
        displayDevices.push({
          id: device.id,
          name: device.name,
          role: role,
          status: status
        });
        this.usedIds.push(device.id)
      });
      this.dataSource.data = displayDevices;
    })
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

  onLock(id: number): void {
    let device: device = {
      id: id,
      name: '',
      func: '',
      status: 0
    }
    this.dbService.update<device>('device/tmp', device)
    .subscribe(result => {
      if(result){
        this.snackBar.open('施錠しました', '閉じる', {duration: 5000});
        this.ngOnInit();
      }
      else{
        this.snackBar.open('施錠できませんでした', '閉じる', {duration: 7000});
      }
    })
  }

  onTempOpen(id: number, name: string): void {
    let dialogRef = this.dialog.open(DeviceTmpopenDialogComponent, {
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

}
