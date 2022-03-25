import { Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DbService } from '../db.service';
import { user } from '../models/user';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.scss']
})
export class NaviComponent implements OnInit {
  user: user = {
    email: '',
    password: '',
    admin: false
  }
  name: string = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private dbService: DbService
    ) {}
  
  ngOnInit(): void {
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
      let cushion = this.user.email.match(/(.*)\..*@/);
      if(cushion !== null && cushion.length > 0){
        this.name = cushion[1];
      }
      else{
        this.name = 'someone'
      }
    });
  }
}


