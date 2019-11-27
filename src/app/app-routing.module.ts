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
import { AdminComponent } from './core/admin/admin.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { ManageproductsComponent } from './core/admin/manageproducts/manageproducts.component';
import { ManagerequestsComponent } from './core/admin/managerequests/managerequests.component';
import { WelcomeComponent } from './core/pages/welcome/welcome.component';
import { AboutComponent } from './core/pages/about/about.component';
import { ContactComponent } from './core/pages/contact/contact.component';
import { ManageusersComponent } from './core/admin/manageusers/manageusers.component';


const routes: Routes = [
  {
    path: 'welcome',
    component: CoreComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: PagesComponent,
        children: [
          {
            path: '',
            component: WelcomeComponent
          }
        ]
      }
    ]
  },
  {
    path: 'about',
    component: CoreComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: PagesComponent,
        children: [
          {
            path: '',
            component: AboutComponent
          }
        ]
      }
    ]
  },
  {
    path: 'contact',
    component: CoreComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: PagesComponent,
        children: [
          {
            path: '',
            component: ContactComponent
          }
        ]
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
    path: 'admin/manageproducts',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            component: ManageproductsComponent
          }
        ]
      }
    ]
  },
  {
    path: 'admin/managerequests',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            component: ManagerequestsComponent
          }
        ]
      }
    ]
  },
  {
    path: 'admin/manageusers',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            component: ManageusersComponent
          }
        ]
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
