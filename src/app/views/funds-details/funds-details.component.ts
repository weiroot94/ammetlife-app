import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { FundsService } from 'src/app/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'app-funds-details',
    templateUrl: './funds-details.component.html',
    styles: []
})

export class FundsDetailsComponent implements OnInit, OnDestroy {

    // Fund Variables
    funds: any = [];
    fundDetails: any = [];

    // Routing Vairables
    fundID: any;
    fundSubscribe: any;

    // Chart Variables
    chart: Chart;
    chartOptions: any;

    // Datepicker Variables
    datepickerConfig: Partial<BsDatepickerConfig>;
    minDate: Date;

    // Form Variables
    filterForm: FormGroup;
    fromDate: Date;
    toDate: Date;
    formValid: boolean = false;
    error: any;
    loading: boolean = false;
    submitted: boolean = false;

    constructor(
        private AR: ActivatedRoute,
        private FS: FundsService,
        private router: Router,
        private FB: FormBuilder
    ) {
        // Get fund id from route
        this.fundSubscribe = this.AR.paramMap.subscribe(params => {
            this.fundID = params.get('fund_id');
        });
    }

    /**
     * Easy access of form controls
     */
    get f() {
        return this.filterForm.controls;
    }

    /**
     * Redirect to home route
     */
    redirect() {
        this.router.navigate(['/']);
    }

    /**
     * Returns YYYY-MM-DD date format if not empty
     * @param date : string
     */
    convertToDate(date: any) {
        if (date == null) return '';
        return moment.utc(date).format('YYYY-MM-DD');
    }

    /* ====================*/
    /*  Funds Dropdown Functions */
    /* ====================*/

    /**
     * Loads all funds list into dropdown
     */
    loadFundsList() {
        this.FS.getFundList()
            .subscribe(
                res => {
                    if (res) {
                        this.funds = res;
                        return;
                    }
                    this.redirect();
                },
                () => {
                    this.redirect();
                }
            );
    }

    /**
     * Route on Dropdown value change and load related fund data
     * @param value :any 
     */
    onFundDropDownChange(value: any) {
        this.router.navigate(['/details', value]);
        this.loadFundDetails();
    }
    //Ends here

    /* ============*/
    /*  Chart Functions */
    /* ============*/

    /**
     * Sets chart config options
     */
    setChartOptions() {
        this.chartOptions = {
            title: {
                text: 'Monthly Average Temperature'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: "%e %b %Y",
                    week: "%b %e, %Y",
                    month: "%b %Y",
                    year: "%b %Y",
                }
            },
            yAxis: {
                title: {
                    text: 'Price(RM)'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                xDateFormat: '%a, %e %b %Y'
            },
            series: [{
                name: 'Fund Price',
                data: this.fundDetails.map,
                type: 'area'
            }]
        };
    }

    /**
     * Initilize chart
     */
    initChart() {
        let chart = new Chart(this.chartOptions);
        this.chart = chart;
    }
    //Ends here

    /* ================*/
    /*  Datepicker Functions  */
    /* ================*/

    /**
     * Sets datepicker config options
     */
    setDatesConfig() {
        this.datepickerConfig = Object.assign({},
            {
                containerClass: 'theme-dark-blue datepicker-container-wrap',
                showWeekNumbers: false,
                dateInputFormat: 'DD MMM YYYY',
            }
        );
    }
    //Ends here

    /* ================*/
    /*  Filter Form Functions  */
    /* ================*/

    /**
     * Validates filter form
     */
    validateFilter() {
        this.formValid = false;
        this.error = false;
        this.filterForm.valueChanges.subscribe(change => {
            var from = change.from;
            var to = change.to;
            if (from != null && to != null) {
                if (moment(to).diff(moment(from)) < 0) {
                    this.f.to.setValue('');
                    this.error = false;
                    this.error = "To date cannot be greater than From date.";
                    this.formValid = false;
                } else {
                    this.formValid = true;
                    this.error = false;
                }
            } else if (from != null && to == null) {
                this.formValid = true;
                this.error = false;
            } else if (from == null && to != null) {
                this.formValid = true;
                this.error = false;
            }
        });
    }

    /**
     * Filter submit callback function
     */
    onFilterSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (!this.formValid) {
            this.submitted = false;
            return;
        }

        var formData = {
            'from': this.convertToDate(this.f.from.value),
            'to': this.convertToDate(this.f.from.value)
        };

        // Start loading
        this.loading = true;

        this.loading = false;
    }
    //Ends here

    /* ================*/
    /*  Fund Details Function */
    /* ================*/

    /**
     * Loads fund details
     */
    loadFundDetails() {
        this.FS.getFundDetails(this.fundID)
            .subscribe(
                res => {
                    if (res) {
                        this.fundDetails = res;
                        this.setChartOptions();
                        this.initChart();
                        this.setDatesConfig();
                    } else {
                        this.redirect();
                    }
                },
                error => {
                    this.redirect();
                }
            );
    }
    //Ends here

    /**
     * Initialize component callback
     */
    ngOnInit() {
        this.filterForm = this.FB.group({
            from: null,
            to: null
        });

        this.loadFundDetails();
        this.loadFundsList();

        this.validateFilter();
    }

    /**
     * Destroy component callback
     */
    ngOnDestroy() {
        this.fundSubscribe.unsubscribe();
        this.fundDetails = null;
        this.chart = null;
    }
}
