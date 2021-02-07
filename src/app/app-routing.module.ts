import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {LayoutComponent} from "./layout/layout.component";
import {NewfeedsComponent} from "./layout/newfeeds/newfeeds.component";
import {FriendComponent} from "./friend/friend.component";
import {PersonalpageComponent} from "./layout/personalpage/personalpage.component";

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login List',
    },
  },
  {
    path: 'friend',
    component: FriendComponent
  },
  {
    path: 'index',
    component: LayoutComponent,
    data: {
      title: 'Index'
    },
    children: [
      {
        path: 'newfeeds',
        component: NewfeedsComponent ,
      },
      {
        path: 'personal/:username',
        component: PersonalpageComponent,
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
