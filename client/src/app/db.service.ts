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

  createUser(user: user): Observable<boolean>{
    return this.http.post('db/user', user, this.httpOptions)
    .pipe(
      map(result => {
        if(result){
          return true;
        }
        else{
          return false;
        }
      }),
      catchError(this.handleError<any>(null)),
      shareReplay(1)
    );
  }

  exist(kind: string, id: string): Observable<boolean> {
    const url = `db/${kind}/exist/${id}`;
    return this.http.get<boolean>(url, this.httpOptions)
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

  get<T>(kind: string, id: number | string): Observable<T> {
    const url = `db/${kind}/${id}`;
    return this.http.get<T>(url, this.httpOptions)
    .pipe(
      catchError(this.handleError<T>())
    );
  }

  getAll<T>(kind: string): Observable<T[]> {
    const url = `db/${kind}`;
    return this.http.get<T[]>(url, this.httpOptions)
    .pipe(
      catchError(this.handleError<T[]>([]))
    );
  }

  add<T>(kind: string, data: T): Observable<boolean> {
    const url = `db/${kind}`;
    return this.http.post<T>(url, data, this.httpOptions)
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

  update<T>(kind: string, data: T): Observable<boolean> {
    const url = `db/${kind}`;
    return this.http.put<T>(url, data, this.httpOptions)
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

  delete<T>(kind: string, id: number | string): Observable<boolean>{
    const url = `db/${kind}/${id}`;
    return this.http.delete<T>(url, this.httpOptions)
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
