import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class FundsService {

  constructor(
    private http: HttpClient,
    private url: UrlService
  ) { }

  private extractData(res: HttpErrorResponse) {
    let body = res;
    return body || {};
  }

  private handleErrorObservable(error: HttpErrorResponse | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  private handleErrorPromise(error: HttpErrorResponse | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

  getDailyFunds(): Observable<any> {
    return this.http
      .get(this.url.get('dailyfunds'))
      .pipe(
        map((res) => {
          return res.data;
        }),
        map((data) => {
          return {
            funds: data.funds,
            date: moment(data.date).format('DD MMM YYYY')
          };
        }),
        catchError(this.handleErrorObservable)
      );
  }

  getFundDetails(fund_id: any): Promise<any> {
    return this.http.get(this.url.get('fund', fund_id)).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  getFundList(): Promise<any> {
    return this.http.get(this.url.get('fundslist')).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }
}