import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './layout/layout.component';
import {NewfeedsComponent} from './layout/newfeeds/newfeeds.component';
import {FriendComponent} from './layout/friend/friend.component';
import {HttpClientModule} from "@angular/common/http";
import { PersonalpageComponent } from './layout/personalpage/personalpage.component';
import { NavbarComponent } from './layout/navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    NewfeedsComponent,
    FriendComponent,
    PersonalpageComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {

}
