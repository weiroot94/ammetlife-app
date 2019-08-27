import { Component, OnInit } from '@angular/core';
import { FundsService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})

export class HomeComponent implements OnInit {

  data: any = [];
  error: any;

  constructor(private dfs: FundsService) { }

  ngOnInit() {
    this.loadDailyFunds();
  }

  loadDailyFunds() {
    this.dfs.getDailyFunds()
      .subscribe(
        res => {
          this.data = res ? res : null;
        },
        error => this.error = <any>error
      );
  }
}
