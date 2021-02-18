import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './layout/layout.component';
import { LayoutAdminComponent } from './admin/components/layout-admin/layout-admin.component';
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {Ng2OrderModule} from "ng2-order-pipe";
import {NgxPaginationModule} from "ngx-pagination";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./admin/service/auth.service";
import {TokenStorageService} from "./admin/service/token/token-storage.service";
import {AuthInterceptorService} from "./admin/service/auth-interceptor.service";
import {JWT_OPTIONS, JwtHelperService, JwtInterceptor} from "@auth0/angular-jwt";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSliderModule} from "@angular/material/slider";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import { UserComponent } from './admin/components/layout-admin/user/user.component';
import { ListComponent } from './admin/components/layout-admin/user/list/list.component';
import { CreateComponent } from './admin/components/layout-admin/user/create/create.component';
import { EditComponent } from './admin/components/layout-admin/user/edit/edit.component';
import {UserService} from "./admin/service/user.service";

import {NewfeedsComponent} from './layout/newfeeds/newfeeds.component';
import {FriendComponent} from './friend/friend.component';
import { PersonalpageComponent } from './layout/personalpage/personalpage.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import {PersonalPageService} from './services/personal-page.service';
import { SettingsComponent } from './layout/settings/settings.component';
import {SettingsService} from './services/settings.service';


@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        LayoutAdminComponent,
        LoginComponent,
        RegisterComponent,
        UserComponent,
        ListComponent,
        CreateComponent,
        EditComponent,
        PersonalpageComponent,
        FriendComponent,
        NavbarComponent,
        NewfeedsComponent,
        SettingsComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatSliderModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    TokenStorageService,
    UserService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    PersonalPageService,
    SettingsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
