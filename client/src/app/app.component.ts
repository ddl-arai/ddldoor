import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatDialog } from '@angular/material/dialog';
import { HomeUpdateComponent } from './home-update/home-update.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DDLDoor';
  constructor(
    private swUpdate: SwUpdate,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    /* Update */
    this.swUpdate.versionUpdates.subscribe(event => {
      if(event.type === 'VERSION_READY'){
        console.log(`A newer version: ${event.latestVersion.hash}`);
        console.log(`Current version: ${event.currentVersion.hash}`);
        this.dialog.open(HomeUpdateComponent, {
          width: '400px',
          disableClose: true
        });
      }
    });

    if(this.swUpdate.isEnabled){
      this.swUpdate.activateUpdate();
      this.swUpdate.checkForUpdate();
    }
  }

  
}
