import {Component, Input, OnInit} from '@angular/core';
import {LayoutComponent} from "../layout.component";
import {Friend} from "../../model/friend";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
