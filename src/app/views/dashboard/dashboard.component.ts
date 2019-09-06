import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    /**
     * Class constructor
     * 
     * @param auth 
     * @param router 
     */
    constructor(
        public auth: AuthService,
        private router: Router
    ) { }

    /**
     * On Init callback
     */
    ngOnInit() {
    }

    /**
     * Logout callback
     * 
     * @param event 
     */
    logout(event: any) {
        event.preventDefault();
        this.auth.logout();
        this.router.navigate(["/login"]);
    }

}
