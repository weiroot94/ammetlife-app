import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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

    /**
     * Handles Observable error
     * @param error
     */
    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(error.message || error);
        return throwError(error.message || error);
    }

    /**
     * Dailly funds callback
     */
    getDailyFunds(): Observable<any> {
        return this.http
            .get(this.url.get('dailyfunds'))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    return {
                        date: moment.utc(res.date).format('DD MMM YYYY'),
                        funds: res.funds.map((data: any) => {
                            return {
                                id: data.fund_id,
                                name: data.name,
                                price: data.price.toFixed(4)
                            }
                        }),
                    };
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Fund details callback
     * @param fund_id 
     */
    getFundDetails(fund_id: any): Observable<any> {
        return this.http
            .get(this.url.get('fund', fund_id))
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    return {
                        description: res.description,
                        as_at: moment.utc(res.as_at).format('DD MMM YYYY'),
                        price: res.price.toFixed(4),
                        price_change: res.price_change > 0 ? '+' + res.price_change.toFixed(4) : res.price_change.toFixed(4),
                        map: res.map.map((map: any) => [moment.utc(map.as_at).valueOf(), parseFloat(map.price.toFixed(4))]),
                    }
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Funds list callback
     */
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

    /**
     * Chart Data Callback
     * @param filter
     */
    getChartData(filter: any): Observable<any> {
        return this.http
            .post(this.url.get('chartdata'), filter)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    if (res == null) {
                        return res;
                    } else {
                        return res.map((map: any) => [moment.utc(map.as_at).valueOf(), parseFloat(map.price.toFixed(4))]);
                    }
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * All Daily Funds calllback
     * @param params
     */
    getAllDailyFunds(params: any): Observable<any> {
        return this.http
            .post(this.url.get('alldailyfunds'), params)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    res.items = res.items.map((data: any) => {
                        return {
                            id: data.id,
                            name: data.name,
                            as_at: moment.utc(data.as_at).format('DD MMM YYYY'),
                            price: parseFloat(data.price.toFixed(4)),
                            status: data.status
                        }
                    })
                    return res;
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
    * All Daily Funds calllback
    * @param params
    */
    getAllFunds(params: any): Observable<any> {
        return this.http
            .post(this.url.get('allfunds'), params)
            .pipe(
                map((res: any) => res = res.data),
                map((res: any) => {
                    res.items = res.items.map((data: any) => {
                        return {
                            id: data.id,
                            name: data.name,
                            short_desc: this.shorten(data.description, 12),
                            description: data.description,
                        }
                    })
                    return res;
                }),
                catchError(this.handleErrorObservable)
            );
    }

    /**
     * Short the string by words
     * 
     * @param str 
     * @param maxLen 
     * @param separator 
     */
    shorten(str: string, maxLen: number, separator: any = ' ') {
        var index = this.nthIndex(str, separator, maxLen);
        if (index <= 0 || str.length <= 0) return str;
        if (str.length <= index) return str;
        return str.substr(0, index) + '...';
    }

    /**
     * Finds nth index ot pattern
     * 
     * @param str 
     * @param pat 
     * @param n 
     */
    nthIndex(str: string, pat: any, n: number) {
        var L = str.length, i = -1;
        while (n-- && i++ < L) {
            i = str.indexOf(pat, i);
            if (i < 0) break;
        }
        return i;
    }

    /**
     * Update fund details
     * 
     * @param params 
     */
    updateFund(params: any): Observable<any> {
        return this.http
            .post(this.url.get('updatefund'), params)
            .pipe(
                map((res: any) => res = res.data),
                catchError(this.handleErrorObservable)
            );
    }
}      