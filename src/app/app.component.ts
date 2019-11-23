import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private _subscription: Subscription;
  constructor(private _userService: UserService){}

  ngOnInit() {

  }

  // check is user logged in
  IsLoggedIn(){
    return this._userService.isUserLoggedIn();
  }

  // check if user is admin
  IsAdmin(){
    return this._userService.isUserAdmin();
  }

  // logout user
  Logout(){
    this._userService.UserLogout();
  }

  ngOnDestroy(){
    if(this._subscription != null)
      this._subscription.unsubscribe();
  }


}
