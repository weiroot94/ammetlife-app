import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartModule } from 'angular-highcharts';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgHttpLoaderModule } from 'ng-http-loader'; 
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor, AuthGuard, ErrorInterceptor } from './helpers';
import { AuthService, DashboardService } from './services';

import {
  HeaderComponent,
  FooterComponent,
  FundsDetailsComponent,
  HomeComponent,
  LoginComponent,
  DashboardComponent,
  UploadComponent,
  FundsComponent,
  DailyfundsComponent
} from './views';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    FundsDetailsComponent,
    LoginComponent,
    DashboardComponent,
    UploadComponent,
    FundsComponent,
    DailyfundsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ChartModule,
    ReactiveFormsModule,
    FormsModule,
    NgProgressModule,
    NgProgressHttpModule,
    BrowserAnimationsModule,
    NgHttpLoaderModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthGuard,
    DashboardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
