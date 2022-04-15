import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DbService } from './db.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InitGuard implements CanActivate {

  constructor(
    private dbService: DbService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.dbService.checkPW()
    .pipe(
      map(result => {
        if(!result){
          this.router.navigate(['init'], {queryParams: {redirectTo: state.url}});
        }
        return result;
      })
    );
  }
  
}
