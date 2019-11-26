// angular imports
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';

// user imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreComponent } from './core/core.component';
import { UserComponent } from './core/user/user.component';
import { AdminComponent } from './core/admin/admin.component';
import { HomeComponent } from './core/home/home.component';
import { PagesComponent } from './core/pages/pages.component';
import { LoginComponent } from './core/user/login/login.component';
import { RegisterComponent } from './core/user/register/register.component';
import { LoginPicComponent } from './core/user/extra/login-pic/login-pic.component';
import { RegisterPicComponent } from './core/user/extra/register-pic/register-pic.component';
import { UserService } from './shared/services/user.service';
import { AuthInterceptorService } from './shared/auth-interceptor';
import { AuthGuard } from './shared/guards/auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { UserGuard } from './shared/guards/user.guard';
import { AddrequestComponent } from './core/home/firstpage/addrequest/addrequest.component';
import { RequesthistoryComponent } from './core/home/request/requesthistory/requesthistory.component';
import { FirstpageComponent } from './core/home/firstpage/firstpage.component';
import { RequestComponent } from './core/home/request/request.component';
import { RequestService } from './shared/services/request.service';
import { ProductService } from './shared/services/product.service';
import { ManageproductsComponent } from './core/admin/manageproducts/manageproducts.component';
import { ManagerequestsComponent } from './core/admin/managerequests/managerequests.component';
import { WelcomeComponent } from './core/pages/welcome/welcome.component';
import { AboutComponent } from './core/pages/about/about.component';
import { ContactComponent } from './core/pages/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    UserComponent,
    AdminComponent,
    HomeComponent,
    PagesComponent,
    LoginComponent,
    RegisterComponent,
    LoginPicComponent,
    RegisterPicComponent,
    AddrequestComponent,
    RequesthistoryComponent,
    FirstpageComponent,
    RequestComponent,
    ManageproductsComponent,
    ManagerequestsComponent,
    WelcomeComponent,
    AboutComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ClarityModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [ 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    UserService, RequestService, ProductService , AuthGuard, AdminGuard, UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
