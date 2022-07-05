import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { user } from '../../../models/user';
import { DbService } from '../../../services/db.service';

@Component({
  selector: 'app-navi-qr',
  templateUrl: './navi-qr.component.html',
  styleUrls: ['./navi-qr.component.scss']
})
export class NaviQrComponent implements OnInit {
  qrdata: string = '';

  constructor(
    public dialogRef: MatDialogRef<NaviQrComponent>,
    @Inject(MAT_DIALOG_DATA) public user: user,
    private dbService: DbService
  ) { }

  ngOnInit(): void {
    this.dbService.genQr()
    .subscribe(token => {
      this.qrdata = `${window.location.protocol}//${window.location.host}/login?email=${this.user.email}&token=${token}`;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
