import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helpers';

import {
  FundsDetailsComponent,
  HomeComponent,
  LoginComponent,
  DashboardComponent,
  UploadComponent,
  FundsComponent,
  DailyfundsComponent
} from './views';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'details/:fund_id',
    component: FundsDetailsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/upload',
    component: UploadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/funds',
    component: FundsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/dailyfunds',
    component: DailyfundsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
