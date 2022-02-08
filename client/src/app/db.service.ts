import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { user } from './models/user'; 

@Injectable({
  providedIn: 'root'
})
export class DbService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient
  ) { }

  createUser(user: user): Observable<any>{
    return this.http.post('db/user', user, this.httpOptions)
    .pipe(
      catchError(this.handleError<any>(null)),
      shareReplay(1)
    );
  }

  userExist(email: string): Observable<boolean> {
    return this.http.post<boolean>('db/user/exist', JSON.stringify({"email": email}), this.httpOptions)
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

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
