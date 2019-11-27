import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;

  constructor(private _formBuilder: FormBuilder, private _userService: UserService, private _router: Router) { }

  toggleCard = false;
  AdvBtn = false;
  DABtn = false;
  MoreBtn = true;

  EditForm: FormGroup;
  ChangePwdForm: FormGroup;
  DeactivateForm: FormGroup;

  ngOnInit() {
    this.LoadUser();
  }

  showAlert: boolean = false;
  showAlert2: boolean = false;
  errorvar: any;
  ErrorMsg = false;
  SuccessMsg = false;

  Id: string;
  Name: string;
  Email: string;
  IsActive: boolean;

  LoadUser(){
    this._subscription = this._userService.GetAllUserData().subscribe((data) => {
      data.forEach(value => {
        if(value.Id == value.CurrentUserId){
            this.Id = value.CurrentUserId;
            this.Name = value.Name;
            this.Email = value.Email;
            this.IsActive = value.IsActive;
            this.CreateForm();
         }
       });
    });
  }


  toggleCardFunction(){
    this.toggleCard = !this.toggleCard;
    this.AdvBtn = false;
    this.ngOnInit();
  }

  AdvFunction(){
    this.AdvBtn = true;
    this.ngOnInit();
  }

  More(){
    this.MoreBtn = !this.MoreBtn;
    this.DABtn = !this.DABtn;
  }

  CreateForm(){
    this.EditForm = this._formBuilder.group({
      Id: [this.Id],
      Name: [this.Name, Validators.required],
      Email: [this.Email, [ Validators.required, Validators.email]]
    });

    this.ChangePwdForm = this._formBuilder.group({
      OldPassword: ['', [ Validators.required, Validators.minLength(6), 
                          Validators.pattern('^(?=.*[0-9])(?=.*[a-z])([a-z0-9_-]+)$') ]],
      NewPassword: ['', [ Validators.required, Validators.minLength(6), 
                          Validators.pattern('^(?=.*[0-9])(?=.*[a-z])([a-z0-9_-]+)$') ]],
      ConfirmPassword: ['', [ Validators.required, Validators.minLength(6), 
                              Validators.pattern('^(?=.*[0-9])(?=.*[a-z])([a-z0-9_-]+)$') ]]
    });
  }

  Update(){

    // check if form is empty
    if(this.EditForm.invalid){
      this.ShowMsg('Fields are empty', 'error');
      return false;
    }

    this._subscription = this._userService.UpdateUser(this.EditForm.value).subscribe((res) => {
      this.ShowMsg('Updated', 'success');
    });

  }

  ChangePassword(){

          // check if form is empty
          if(this.ChangePwdForm.invalid){
            this.ShowMsg2('Fields are empty', 'error');
            return false;
          }

        // check if passwords match
        if(this.ChangePwdForm.value.ConfirmPassword != this.ChangePwdForm.value.NewPassword){
          this.ShowMsg2('Passwords Should Match', 'error');
          return false;
        }
    
        this._subscription = this._userService.ChangePassword(this.ChangePwdForm.value).subscribe((res) => {
          this.ShowMsg2('Changed', 'success');
        }, (error) => {
            this.ShowMsg2('Passwords Is Incorrect', 'error');
            return false;
        });
  }

  Deactivate(){

    this.DeactivateForm = this._formBuilder.group({
      UserId: [this.Id],
      IsActive: [!this.IsActive]
    });

    this._subscription = this._userService.UserActiveness(this.DeactivateForm.value);
    setTimeout(()=>{ 
      this._userService.UserLogout();
      this._router.navigateByUrl['user/login'];
    }, 1000);   
}

  // the fn to show alert
  ShowMsg(msg, type){
    if(type == "success"){
      this.ErrorMsg = false;
      this.SuccessMsg = true;
    }else{
      this.ErrorMsg = true;
      this.SuccessMsg = false;
    }
    this.errorvar = msg;
    this.showAlert = true;
    setTimeout(()=>{ 
      this.showAlert = false;
      if(type == "success")
         this.toggleCardFunction();
    }, 1000);
}


// the fn to show alert
ShowMsg2(msg, type){
  if(type == "success"){
    this.ErrorMsg = false;
    this.SuccessMsg = true;
  }else{
    this.ErrorMsg = true;
    this.SuccessMsg = false;
  }
  this.errorvar = msg;
  this.showAlert2 = true;
  setTimeout(()=>{ 
    this.showAlert2 = false;
    if(type == "success")
         this.toggleCardFunction();
  }, 1000);
}


  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }

}
