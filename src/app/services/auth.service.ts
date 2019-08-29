import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import SimpleCrypto from "simple-crypto-js";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _loginUrl = `${environment.api}/auth/login`;
  private _userUrl = `${environment.api}/auth/user`;
  private _secretKey = "x9$lPGl1BWdQfVLpQd@J8r*ylY#1wu9j6OpXO7tEnM";
  private simpleCrypto: any;

  constructor(
    private http: HttpClient,
  ) {
    this.simpleCrypto = new SimpleCrypto(this._secretKey);
  }

  private setSession(authResult: any) {
    localStorage.setItem('userToken', this.simpleCrypto.encrypt(authResult.data.token));
  }

  private deleteSession() {
    localStorage.removeItem("userToken");
  }

  public getToken() {
    if (!localStorage.getItem("userToken")) return false;
    return this.simpleCrypto.decrypt(localStorage.getItem("userToken"));
  }

  public isLoggedIn() {
    if (this.getToken()) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  public login(user: any) {
    return this.http.post<any>(this._loginUrl, user)
      .pipe(
        map(
          res => {
            this.setSession(res);
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
}
