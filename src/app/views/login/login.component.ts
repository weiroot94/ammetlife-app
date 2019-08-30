import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from 'src/app/services';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    loading: boolean = false;
    submitted: boolean = false;
    returnUrl: string;
    error: any = '';

    constructor(
        private _fB: FormBuilder,
        private auth: AuthService,
        private _router: Router,
        private _route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.loginForm = this._fB.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/dashboard';

        // redirect to home if already logged in
        if (this.auth.isLoggedIn()) {
            this._router.navigate(['/dashboard']);
        }
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        this.auth.login({ 'email': this.f.username.value, 'password': this.f.password.value })
            .pipe(first())
            .subscribe(
                data => {
                    this._router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                }
            );
    }
}
