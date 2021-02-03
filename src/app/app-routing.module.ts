import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {LayoutAdminComponent} from "./admin/components/layout-admin/layout-admin.component";
import {AuthGuard} from "./admin/service/guards/auth.guard";
import {UserComponent} from "./admin/components/layout-admin/user/user.component";
import {ListComponent} from "./admin/components/layout-admin/user/list/list.component";
import {EditComponent} from "./admin/components/layout-admin/user/edit/edit.component";
import {CreateComponent} from "./admin/components/layout-admin/user/create/create.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login List',
    },
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'admin',
    component: LayoutAdminComponent,
    data: {
      title: 'Admin Layout'
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'user',
        component: UserComponent,
        children: [
          {
            path: 'list',
            component: ListComponent
          },
          {
            path: 'edit/:id',
            component: EditComponent
          },
          {
            path: 'create',
            component: CreateComponent
          },
          // {
          //   path: 'detail/:id',
          //   component:
          // },
          {
            path: '',
            redirectTo: '/admin/user/list',
            pathMatch: 'full'
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
