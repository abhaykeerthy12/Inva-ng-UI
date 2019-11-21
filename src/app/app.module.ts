import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreComponent } from './core/core.component';
import { UserComponent } from './core/user/user.component';
import { AdminComponent } from './core/admin/admin.component';
import { HomeComponent } from './core/home/home.component';
import { PagesComponent } from './core/pages/pages.component';
import { LoginComponent } from './core/user/login/login.component';
import { RegisterComponent } from './core/user/register/register.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    CoreComponent,
    UserComponent,
    AdminComponent,
    HomeComponent,
    PagesComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
