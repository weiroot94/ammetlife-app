import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UrlService {
  private urls: any;
  private base: string = `${environment.api}`

  constructor() {
    this.urls = {
      'login': 'auth/login',
      'user': 'auth/user',
      'upload': 'uplaod-funds',
      'dailyfundslist': 'view-daily-funds',
      'dailyfunds': 'daily-funds',
      'fundslist': 'funds-list',
      'fund': 'fund-details',
      'chartdata': 'chart-data',
    };
  }

  get(slug: string = '', param?: any) {
    var url = this.base;
    var join = '/';

    if (slug == '') return url;

    if (slug in this.urls) {
      url += join + this.urls[slug];
      if (param) {
        url += join + param;
      }
      return url;
    }
    
    return url;
  }
}
