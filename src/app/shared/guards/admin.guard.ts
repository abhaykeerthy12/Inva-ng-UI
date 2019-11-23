import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private _router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    

      // check if logged in user is admin
      if(localStorage.getItem('ACCESS_TOKEN') != null){
        if(localStorage.getItem('ROLES') == "Admin" && localStorage.getItem('Roles') != "[]"){
          return true;
        }else{
          this._router.navigate(['/home']);
          return false;
        }       
      }else{
        this._router.navigate(['/home']);
        return false;
      }

  }
  
}
