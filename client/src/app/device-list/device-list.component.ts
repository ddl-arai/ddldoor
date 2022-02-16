import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { device } from '../models/device';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDialogComponent } from '../device-dialog/device-dialog.component';
import { EditDeviceDialogComponent } from '../edit-device-dialog/edit-device-dialog.component';
import { DeleteDeviceDialogComponent } from '../delete-device-dialog/delete-device-dialog.component';

export interface displayData {
  id: number,
  name: string,
  role: string // 入口 or 出口
}


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'role',
    'action'
  ];
  dataSource = new MatTableDataSource<displayData>();
  usedIds: number[] = [];

  constructor(
    private dbService: DbService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getDevices();
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
        let role: string;
        switch(device.func){
          case 'enter':
            role = '入口'
            break;
          case 'exit':
            role = '出口';
            break;
          default:
            role = '';
            break;
        }
        displayDevices.push({
          id: device.id,
          name: device.name,
          role: role
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

}
