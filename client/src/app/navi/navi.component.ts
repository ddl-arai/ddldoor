import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DbService } from '../db.service';
import { user } from '../models/user';
import { NaviSetMemberComponent } from '../navi-set-member/navi-set-member.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss']
})
export class NaviComponent implements OnInit {
  user: user = {
    email: '',
    password: '',
    admin: false,
  }
  name: string = '';
  badge: boolean = false;

  @ViewChild('drawer') sidenav!: MatSidenav;

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
    public dialog: MatDialog
    ) {}
  
  ngOnInit(): void {
    this.badge = false;
    this.getUser();
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
      this.user = user
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
    let dialogRef = this.dialog.open(NaviSetMemberComponent, {
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
}


