import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _uploadUrl = `${environment.api}/uplaod-funds`
  private _viewFundsUrl = `${environment.api}/view-funds`
  private _viewDailyFundsUrl = `${environment.api}/view-daily-funds`

  private extractData(res: HttpErrorResponse) {
    let body = res;
    return body || {};
  }

  private handleErrorObservable(error: HttpErrorResponse | any) {
    console.error(error.message || error.error || error);
    return throwError(error.message || error.error || error);
  }

  private handleErrorPromise(error: HttpErrorResponse | any) {
    console.error(error.message || error.error || error);
    return Promise.reject(error.message || error.error || error);
  }

  constructor(private http: HttpClient) { }

  uploaFunds(uploadData: any): Observable<any> {
    return this.http.post(this._uploadUrl, uploadData)
      .pipe(
        map(this.extractData),
        catchError(this.handleErrorObservable)
      );
  }
}
