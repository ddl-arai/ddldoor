import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DbService } from '../../services/db.service';
import { user } from '../../models/user';
import { NaviMemberLinkComponent } from '../dialogs/navi-member-link/navi-member-link.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NaviQrComponent } from '../dialogs/navi-qr/navi-qr.component';
import { MatMenu, MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { TutrialModalComponent } from '../tutrial-modal/tutrial-modal.component';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss']
})
export class NaviComponent implements OnInit, AfterViewInit {
  user: user = {
    email: '',
    password: '',
    admin: false,
  }
  name: string = '';
  badge: boolean = false;
  dialogId: string = '';

  @ViewChild('drawer') sidenav!: MatSidenav;
  //@ViewChild('userMenu') menu!: MatMenu;
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay(1)
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private dbService: DbService,
    public dialog: MatDialog,
    ) {}
  
  ngOnInit(): void {
    this.badge = false;
    this.getUser();
  }

  ngAfterViewInit(): void {
    if(!this.user.tutorial){
      this.menuTrigger.openMenu();
      this.dialogId = this.dialog.open(TutrialModalComponent, {
        hasBackdrop: false,
        panelClass: 'tutorial',
      }).id;
    }
  }

  /* Here is called only when tutorial */
  onMenuClose(){
    let isOpened = this.dialog.getDialogById(this.dialogId);
    if(isOpened) {
      isOpened.close();
      this.user.tutorial = true;
      this.dbService.update<user>('user/tutorial', this.user).subscribe();
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  onResetPW(): void {
    this.dbService.resetPW()
    .subscribe(token => {
      this.authService.logout()
      .subscribe(() => {
        this.router.navigate([`/reset/${token}`]);
      });
    });
  }

  getUser(): void {
    this.dbService.getUser()
    .subscribe(user => {
      this.user = user;
      if(!this.user.associated_member_id || this.user.associated_member_id === 0){
        this.badge = true;
      }
      let cushion = this.user.email.match(/(.*)\..*@/);
      if(cushion !== null && cushion.length > 0){
        this.name = cushion[1];
      }
      else{
        this.name = 'someone'
      }    
    });
  }

  onSetMember(): void {
    let dialogRef = this.dialog.open(NaviMemberLinkComponent, {
		  width: '400px',
      data: this.user
		});
		dialogRef.afterClosed().subscribe(() => {
		  this.ngOnInit();
		});
  }

  onClose(): void {
    this.isHandset$
    .pipe(first())
    .subscribe(result => {
      if(result) this.sidenav.close();
    })
  }

  onHelp(): void {
    this.router.navigate(['/home/help']);
  }

  onQr(): void {
    this.dialog.open(NaviQrComponent, {
      width: '400px',
      data: this.user
    });
  }
}


