import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {

  constructor() { }

  bottomMap:boolean = false
  bottomContact:boolean = false

  showContact(){
    this.bottomContact = true
  }

  showMap(){
    this.bottomMap = true
  }

  ngOnInit() {
  }

}
