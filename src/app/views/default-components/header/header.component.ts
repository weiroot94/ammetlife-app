import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styles: []
})

export class HeaderComponent implements OnInit {

    constructor(
        public auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    logout(event: any) {
        event.preventDefault();
        this.auth.logout();
        this.router.navigate(["/login"]);
    }
}
