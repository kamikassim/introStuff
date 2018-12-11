import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unsupported-browsers',
  templateUrl: './unsupported-browsers.component.html',
  styleUrls: ['./unsupported-browsers.component.scss']
})
export class UnsupportedBrowsersComponent implements OnInit {
  unsupportedImageURL:string = "./assets/img/unsupported_browser.png"  
  constructor() { }

  ngOnInit() {
  }

}
