import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// user imports
import { UserComponent } from './core/user/user.component';
import { LoginComponent } from './core/user/login/login.component';
import { RegisterComponent } from './core/user/register/register.component';
import { HomeComponent } from './core/home/home.component';
import { CoreComponent } from './core/core.component';
import { AppComponent } from './app.component';
import { PagesComponent } from './core/pages/pages.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { UserGuard } from './shared/guards/user.guard';
import { RequesthistoryComponent } from './core/home/request/requesthistory/requesthistory.component';
import { FirstpageComponent } from './core/home/firstpage/firstpage.component';
import { RequestComponent } from './core/home/request/request.component';


const routes: Routes = [
  {
    path: 'welcome',
    component: CoreComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: PagesComponent
      }
    ]
  },
  {
    path: 'user/login',
    component: UserComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
        canActivate: [UserGuard]
      }
    ]
  },
  {
    path: 'user/register',
    component: UserComponent,
    children: [
      {
        path: '',
        component: RegisterComponent,
        canActivate: [UserGuard]
      }
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: FirstpageComponent
      }
    ]
  },
  {
    path: 'history',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: RequestComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
      path: '**',
      redirectTo: 'welcome',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
