import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  input:string = ""
  num:number = 2
  submitButtonText:string = "Submit This By Clicking " + this.num
  betaImageUrl:string = "./assets/img/beta_label.png"
  
  constructor(private http:HttpClient) {}

  // submit(){
  //   this.log(this.input)
  //   let url = "https://aeb4oc6uwg.execute-api.us-east-1.amazonaws.com/prod/getevents"
  //   let request = this.http.request("POST",url, {
  //     body: {
  //       email : this.input,
  //       password: ''
  //     },
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).subscribe(
  //     response => {
  //       alert(JSON.stringify(response))
  //     },
  //     error => {
  //       alert(JSON.stringify(error))
  //     }
  //   ) 
  // }

  log(str:string){
    // // // console.log(str)
  }

  ngOnInit() {
    this.autoplaySafari()
  }

  autoplaySafari(){
    var ua = navigator.userAgent.toLowerCase();
    var is_safari = (ua.indexOf("safari/") > -1 && ua.indexOf("chrome") < 0);
    if(is_safari) {
        console.log('is safari')
        var video = <any> document.getElementById('video')
        video.play()
    }   
  }

}
