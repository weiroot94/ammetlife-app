import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _auth: AuthService
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean> | Promise<boolean> | boolean {
    if (!this._auth.isLoggedIn()) {
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }

}