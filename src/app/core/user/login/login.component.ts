import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, empty } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;
  showAlert: boolean = false;
  errorvar: any;

  constructor(
        private _formBuilder: FormBuilder, 
        private _userService: UserService, 
        private _router: Router,
  ) { }

  ngOnInit() {
    this.CreateForm();
  }

  LoginForm: FormGroup;

  CreateForm(){
    this.LoginForm = this._formBuilder.group({
      Email: ['', [ Validators.required, Validators.email]],
      Password: ['', [ Validators.required, Validators.minLength(6) ]],
      grant_type: ["password"]
    });
  }

  Login(){

    // check if form is empty
    if(this.LoginForm.invalid){
        this.ShowError('Fields are empty');
        return false;
    }

    this._subscription = this._userService.LoginToDB(this.LoginForm.value).subscribe((data: any) => 
    {
        // if everything ok then add values to localstorage and redirect 
        localStorage.setItem('ACCESS_TOKEN', data['access_token']);
        if(data['roles'] != "[]")
        {
          if (data['roles'].includes('\"')) 
          { 
            data['roles'] = JSON.parse(data['roles']); 
            localStorage.setItem('ROLES', data['roles']);
          }
        }
        this._router.navigate(['/home']);
     },

     // if there is error, check type of error and show error alert
      (error: HttpErrorResponse) => {
          if(error){
            if(error.status == 400){
              this.ShowError('Invalid Credentials');
            }
          }
      });  
  }
  
  ShowError(error){

      this.errorvar = error;
      this.showAlert = true;
      setTimeout(()=>{ 
        this.showAlert = false;
      }, 5000);
  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }

}
