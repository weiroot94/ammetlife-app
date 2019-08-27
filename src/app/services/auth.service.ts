import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map, first, filter } from 'rxjs/operators';
import SimpleCrypto from "simple-crypto-js";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _loginUrl = `${environment.api}/auth/login`;
  private _userUrl = `${environment.api}/auth/user`;
  private _secretKey = "x9$lPGl1BWdQfVLpQd@J8r*ylY#1wu9j6OpXO7tEnM";
  private simpleCrypto: any;

  public currentUser: any = false;

  constructor(
    private http: HttpClient,
    private _router: Router,
  ) {
    this.simpleCrypto = new SimpleCrypto(this._secretKey);
    /* this._router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.refreshUser();
    }); */
  }

  private setSession(authResult: any) {
    localStorage.setItem('userToken', this.simpleCrypto.encrypt(authResult.data.token));
    this.currentUser = authResult.data.token;
  }

  private deleteSession() {
    localStorage.removeItem("userToken");
    this.currentUser = false;
  }

  public getToken() {
    if (!localStorage.getItem("userToken")) return false;
    return this.simpleCrypto.decrypt(localStorage.getItem("userToken"));
  }

  public isLoggedIn() {
    if (this.getToken() && this.currentUser !== null) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  public login(user) {
    return this.http.post<any>(this._loginUrl, user)
      .pipe(
        map(
          res => {
            this.setSession(res);
            return res;
          }
        )
      );
  }

  public logout() {
    this.deleteSession();
  }

  public GetUser() {
    return this.http.get<any>(this._userUrl);
  }

  refreshUser() {
    if (!this.isLoggedIn()) {
      return;
    }
    return this.GetUser()
      .subscribe(
        res => {
          this.currentUser = res.data;
        },
        err => {
          console.log(err)
        }
      );
  }
}
