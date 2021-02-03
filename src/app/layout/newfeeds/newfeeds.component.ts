import { Component, OnInit } from '@angular/core';
import {Post} from "../../model/newfeedpost";
import {NewfeedservicesService} from "../../services/newfeedservices.service";

@Component({
  selector: 'app-newfeeds',
  templateUrl: './newfeeds.component.html',
  styleUrls: ['./newfeeds.component.css']
})
export class NewfeedsComponent implements OnInit {

  postList: Post[] = [];

  constructor(public ps : NewfeedservicesService) { }

  ngOnInit(): void {
    this.ps.getAllPost().subscribe(response =>{
      this.postList = response.data;
    })
  }

}
