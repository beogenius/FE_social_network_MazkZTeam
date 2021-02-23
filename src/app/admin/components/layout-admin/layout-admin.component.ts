import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {map, shareReplay} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.css']
})
export class LayoutAdminComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl("/login");
  }
}
