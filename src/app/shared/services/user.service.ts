import { Injectable } from '@angular/core';
import { UserModel } from '../models/user-model';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient, private _router: Router) { }

  readonly Root_URL = "https://localhost:44358";


  // get all user data
  GetAllUserData():Observable<UserModel[]>{
    return this._http.get<UserModel[]>(this.Root_URL + '/api/account/alluserdata');
  }

  // get all roles
  GetRoles(){
    return this._http.get(this.Root_URL + '/api/roles/getroles');
  }

  // get all user roles
  GetUserRoles(){
    return this._http.get(this.Root_URL + '/api/roles/getuserroles');
  }

  // make user active or inactive
  UserActiveness(formData){
    
    let body = {
      "Id": formData.UserId,
      "IsActive": formData.IsActive,
    }
  
    return this._http.patch(this.Root_URL + '/api/account/useractive', body).subscribe(res => {
      console.log(res);
    });
  }

  // make user admin or user
  UserPermission(formData){
    
    let body = {
      "Id": formData.UserId,
      "Role": formData.Role,
    }
  
    return this._http.post(this.Root_URL + '/api/roles', body).subscribe(res => {
      console.log(res);
    });
  }

  // register method 
  RegisterToDB(formData){

    let body: UserModel = {
      Name: formData.Name,
      Email: formData.Email,
      Password: formData.Password,
      ConfirmPassword: formData.ConfirmPassword
    }

    let reqheaders = new HttpHeaders({'No_Auth': 'true'});
    return this._http.post(this.Root_URL + '/api/account/register', body, {headers: reqheaders});
}

  // login method
  LoginToDB(formData){ 

    // use url search params in body
    let body = new URLSearchParams();
    body.set('Username', formData.Email);
    body.set('Password', formData.Password);
    body.set('grant_type', formData.grant_type);

    let reqheaders = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded' ,'No_Auth': 'true'});
    return this._http.post(this.Root_URL + '/token', body.toString(), {headers: reqheaders});
  }

  // check if user is logged in
  isUserLoggedIn(){
    if(localStorage.getItem('ACCESS_TOKEN') != null){
      return true;
    }else{
      return false;
    }
  }

  // check if user is admin
  isUserAdmin(){
    if(localStorage.getItem('ROLES') === "Admin"){
      return true;
    }else{
      return false;
    }
  }

  // logout user
  UserLogout(){
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('ROLES');
    this._router.navigate(['user/login']);
  }

}
