import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FundsService } from 'src/app/services';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-dailyfunds',
    templateUrl: './dailyfunds.component.html',
})

export class DailyfundsComponent implements OnInit {
    // Define variables
    page: number = 1;
    total: number;

    perPage = new FormControl(15);
    fundType = new FormControl('');
    date = new FormControl('');

    fundLists: any;
    funds: any;

    // Datepicker Variables
    datepickerConfig: Partial<BsDatepickerConfig>;

    loading: boolean = false;
    /**
     * Class constructor
     * 
     * @param router
     * @param FS 
     */
    constructor(private router: Router, private FS: FundsService) { }

    /**
     * Sets datepicker config
     */
    setDatepickerConfig() {
        this.datepickerConfig = Object.assign({},
            {
                containerClass: 'theme-dark-blue datepicker-container-wrap',
                showWeekNumbers: false,
                dateInputFormat: 'DD MMM YYYY',
                isAnimated: true,
                adaptivePosition: true,
            }
        );
    }

    /**
    * Loads all funds list into dropdown
    */
    loadFundsList() {
        this.FS.getFundList()
            .subscribe(
                res => {
                    this.fundLists = res;
                },
                error => {
                    console.log(error);
                }
            );
    }

    /**
     * Loads current page data
     * 
     * @param page 
     */
    getPage(page: number) {
        var date = this.date.value;
        var params = {
            offset: page - 1,
            per_page: this.perPage.value,
            fund: this.fundType.value == '' ? '' : parseInt(this.fundType.value),
            date: date == '' || date == null ? '' : moment.utc(date).format('YYYY-MM-DD'),
        };

        this.loading = true;

        this.FS.getAllDailyFunds(params)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(
                res => {
                    this.funds = res.items;
                    this.total = res.total;
                    this.page = page;
                },
                () => {
                    this.router.navigate(['/dashboard']);
                }
            )
    }

    /**
     * Values changes callback
     */
    onChange() {
        this.date.valueChanges.subscribe(() => this.getPage(1));
        this.fundType.valueChanges.subscribe(() => this.getPage(1));
        this.perPage.valueChanges.subscribe(() => this.getPage(this.page));
    }

    /**
     * Clears date field
     */
    clearDate() {
        if (this.date.value != '' && this.date.value != null) {
            this.date.reset();
        }
        return;
    }

    /**
     * OnInit callback
     */
    ngOnInit() {
        this.loadFundsList();
        this.setDatepickerConfig();
        this.getPage(1);
        this.onChange();
    }

    getRowSpan(date: string) {
        return this.funds.filter((obj: any) => obj.as_at === date).length;
    }

    statusChange(date: any, status: number) {
        date = moment.utc(date, 'DD MMM YYYY').format('YYYY-MM-DD');
        this.FS.statusChange(date, status)
            .subscribe(
                () => {
                    this.getPage(this.page);
                },
                err => {
                    console.log(err);
                }
            )
    }
}
