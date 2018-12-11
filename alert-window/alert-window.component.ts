import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertWindowService } from '../alert-window.service';

@Component({
  selector: 'app-alert-window',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: './alert-window.component.html',
  styleUrls: ['./alert-window.component.scss']
})
export class AlertWindowComponent implements OnInit {

  active:boolean = false
  visible:boolean = false
  data:string = "Success!"
  buttonVisible:boolean = true

  setFontSize(){
    // return 60 - this.data.length
    return 2
  }

  constructor(private alertwindowservice:AlertWindowService) { 
    alertwindowservice.alertActiveState$.subscribe(
      (alertActiveState:boolean) =>{
        this.active = alertActiveState
      }
    )
    
    alertwindowservice.alertActiveState$.subscribe(
      (alertActiveState:boolean) =>{
        this.active = alertActiveState
      }
     )

    alertwindowservice.alertVisibleState$.subscribe(
      (alertVisibleState:boolean) =>{
        this.visible = alertVisibleState
      }
    )

    alertwindowservice.alertDataSource$.subscribe(
      (alertWindowData:string) =>{
        this.data = alertWindowData
      }
    )

    alertwindowservice.buttonVisibility$.subscribe(
      (buttonVisible:boolean) => {
        this.buttonVisible = buttonVisible
      }
    )
  }

  hide(){
    this.alertwindowservice.hide()
  }

  ngOnInit() {
  }

}
