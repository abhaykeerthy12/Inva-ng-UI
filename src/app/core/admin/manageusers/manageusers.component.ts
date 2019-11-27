import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {ClrDatagridSortOrder} from '@clr/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Key, element } from 'protractor';

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.scss']
})
export class ManageusersComponent implements OnInit, OnDestroy {

  private _subscription: Subscription

  constructor(private _userService: UserService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.LoadUsers();
  }

  users = [];
  userroles = [];
  roles = [];
  userwithroles = [];
  rows = [];
  realroles =[];
  realArray = [];
  selectedUser = false;
  UsersForm: FormGroup;
  showAlert: boolean = false;
  errorvar: any;
  ErrorMsg = false;
  SuccessMsg = false;

  // Get all users from the server
  LoadUsers(){
    this.users = [];
    this._subscription =  this._userService.GetAllUserData().subscribe(
      (data) => {
          data.forEach(value => {
              this.users.push(value);
          });
          // console.log(this.users);
          this.LoadUserRoles();
      });
  }

  // Get all user roles from the server
  LoadUserRoles(){
    this.userroles = [];
    this._subscription =  this._userService.GetUserRoles().subscribe(
      (data) => {
        for(var key in data) {
          if (data.hasOwnProperty(key)) {
              this.userroles.push(data[key]);
          }
        }
        this.ExtractRoles(this.userroles);
      });     
  }

  // extract role userroles array
  ExtractRoles(userroles){
  this.userwithroles = [];
    userroles.forEach(val => {
      if(val.Roles.length > 0){
        val.Roles.forEach(element => {
          this.userwithroles.push({
            "UserId": element.UserId,
            "RoleId": element.RoleId
          });
        });
      }
    });
    this.LoadRoles();
  }

   // Get all user roles from the server
   LoadRoles(){
    this.roles = [];
    this._subscription =  this._userService.GetRoles().subscribe(
      (data) => {
        for(var key in data) {
          if (data.hasOwnProperty(key)) {
              this.roles.push(data[key]);
          }
        }
        this.CombineArray(this.roles, this.userwithroles, this.users);
      });
  }


  CombineArray(roles, userwithroles, users){

    this.rows = [];
    this.realArray = [];
    let admin = false;
    this.realroles = [];

    // make an array or userid + rolename
    userwithroles.forEach(ur => {
      roles.forEach(role => {
        if(ur.RoleId == role.Id){
          this.realroles.push({
            "UserId": ur.UserId,
            "Role": role.Name
          });
        }
      });
    });

    let IsAdmin = userId =>{   
     admin = false;   
     this.realroles.forEach(role => {
        if(userId == role.UserId){
            return  admin = true;
        }
      });
    }

    users.forEach(user => {
      // show user apart from app user
      if(user.Id != user.CurrentUserId){
        IsAdmin(user.Id);
        this.rows.push({
          "UserId": user.Id,
          "Name": user.Name,
          "Email": user.Email,
          "IsActive": user.IsActive,
          "IsAdmin": admin
          });
      }
    });

    this.realArray = this.rows;

  }

  Activeness(user){
    this.UsersForm = this._formBuilder.group({
      "UserId": [user.UserId],
      "IsActive": [!user.IsActive]
    });
    this._subscription = this._userService.UserActiveness(this.UsersForm.value);
    this.ShowMsg('Done!', 'success');
  }

  Permission(user){
    let Role;

    if(user.IsAdmin == true){
      Role = "User";
    }else{
      Role = "Admin";
    }
    this.UsersForm = this._formBuilder.group({
      "UserId": [user.UserId],
      "Role": [Role]
    });
    this._subscription = this._userService.UserPermission(this.UsersForm.value);
    this.ShowMsg('Done!', 'success');
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
      this.ngOnInit();
      this.showAlert = false;
    }, 1000);
}

  Cancel(){
    this.ngOnInit();
  }

  Search(SearchString){

    this.rows = this.realArray;
    SearchString = SearchString.toLowerCase();
    let tmpArray = [];

    if(( SearchString != null ) || ( SearchString != "" ) ){
      for (let i = 0; i < this.rows.length; i++) {
        let a = this.rows[i].Name.toLowerCase();
        if(a.indexOf(SearchString) > -1){
          tmpArray.push(this.rows[i]);
      }
    } 
      this.rows = tmpArray;
    }else{
      this.rows = this.realArray;
    }

  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }

}
