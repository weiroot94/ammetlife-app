import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as moment from 'moment';

// Import Services
import { UrlService } from './url.service';

@Injectable({
    providedIn: 'root'
})

export class FundsService {

    constructor(
        private http: HttpClient,
        private url: UrlService
    ) { }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }

    getDailyFunds(): Observable<any> {
        return this.http
            .get(this.url.get('dailyfunds'))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    return {
                        date: moment.utc(res.date).format('DD MMM YYYY'),
                        funds: res.funds,
                    };
                }),
                map((r: any) => {
                    r.funds = r.funds.map((data: any) => {
                        data.price = data.price.toFixed(4);
                        return data;
                    })
                    return r;
                }),
                catchError(this.handleErrorObservable)
            );
    }

    getFundDetails(fund_id: any): Observable<any> {
        return this.http
            .get(this.url.get('fund', fund_id))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    res.as_at = moment.utc(res.as_at).format('DD MMM YYYY');
                    res.price = res.price.toFixed(4);
                    res.price_change = res.price_change.toFixed(4);
                    res.price_change = res.price_change > 0 ? '+' + res.price_change : res.price_change;
                    res.map = res.map.map((map: any) => [moment.utc(map.as_at).valueOf(), parseFloat(map.price.toFixed(4))])
                    return res;
                }),
                catchError(this.handleErrorObservable)
            );
    }

    getFundList(): Observable<any> {
        return this.http
            .get(this.url.get('fundslist'))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    return res.map((data: any) => {
                        return {
                            id: data.id,
                            name: data.name,
                        };
                    })
                }),
                catchError(this.handleErrorObservable)
            );
    }

    getChartData(filter: any): Observable<any> {
        return this.http
            .post(this.url.get('chartdata'), filter)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    res.map = res.map.map((map: any) => [moment.utc(map.as_at).valueOf(), parseFloat(map.price.toFixed(4))])
                    return res;
                }),
                catchError(this.handleErrorObservable)
            );
    }
}      