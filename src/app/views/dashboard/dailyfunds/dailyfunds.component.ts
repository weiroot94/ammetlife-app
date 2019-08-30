import { Component, OnInit } from '@angular/core';
import { FundsService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dailyfunds',
    templateUrl: './dailyfunds.component.html',
    styleUrls: ['./dailyfunds.component.scss'],
})
export class DailyfundsComponent implements OnInit {
    // Define variables
    page: number = 1;
    perPage: number = 15;
    total: number;

    funds: any;

    constructor(
        private router: Router,
        private FB: FundsService
    ) { }

    getPage(page: number) {
        this.FB.getAllDailyFunds({ offset: page - 1, per_page: this.perPage, })
            .subscribe(
                res => {
                    this.funds = res.items;
                    this.total = res.total;
                    this.page = page;
                },
                err => {
                    this.router.navigate(['/dashboard']);
                }
            )
    }

    ngOnInit() {
        this.getPage(1);
    }

}
