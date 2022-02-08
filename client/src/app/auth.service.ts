import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { user } from './models/user';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import { shareReplay, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient
  ) { }

  login(user: user): Observable<boolean>{
    return this.http.post<user>('/auth/login', user, this.httpOptions)
    .pipe(
      map(result =>{
        if(result){
          return true;
        }
        else{
          return false;
        }
      }),
      catchError(this.handleError<boolean>(false)),
      shareReplay(1)
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>('/auth/check', this.httpOptions)
    .pipe(
      map(result => {
        if(result){
          return true;
        }
        else{
          return false;
        }
      }),
      catchError(this.handleError<boolean>(false))
    );
  }

  logout(): Observable<string>{
    return this.http.get<string>('/auth/logout', this.httpOptions)
    .pipe(
      catchError(this.handleError<string>('logout failed'))
    );
  }

  handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(result as T);
    }
  }

}
