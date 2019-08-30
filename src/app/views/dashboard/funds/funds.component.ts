import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FundsService } from 'src/app/services';

@Component({
    selector: 'app-funds',
    templateUrl: './funds.component.html',
    styleUrls: ['./funds.component.scss']
})
export class FundsComponent implements OnInit {
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
        this.FB.getAllFunds({ offset: page - 1, per_page: this.perPage, })
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
