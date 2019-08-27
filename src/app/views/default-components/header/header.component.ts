import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(
    public _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit() {
  }

  logout(event: any) {
    event.preventDefault();
    this._auth.logout();
    this._router.navigate(["/login"]);
  }
}
