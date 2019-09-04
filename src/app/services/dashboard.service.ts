import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UrlService } from './url.service';

@Injectable({
    providedIn: 'root'
})

export class DashboardService {


    constructor(private http: HttpClient, private url: UrlService) { }

    private handleErrorObservable(error: HttpErrorResponse | any) {
        console.error(error.message || error.error || error);
        return throwError(error.message || error.error || error);
    }

    uploaFunds(uploadData: any): Observable<any> {
        return this.http
            .post(this.url.get('upload'), uploadData)
            .pipe(
                map((res: any) => res = res.data),
                catchError(this.handleErrorObservable)
            );
    }
}
