import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { AuthUser } from '../classes/auth-user';
import { AlertWindowService } from '../alert-window.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  constructor(private router:Router, private http: HttpClient, private auth: AuthService ,private alertwindowservice:AlertWindowService) { 
  }

  user: AuthUser
  events = []

  getEvents() {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/geteventfeed'
    let params = {
      uid: this.user ? this.user.get('uid') : null,
      authToken: this.user ? this.user.get('authToken') : null
    }
    
    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err) 
        }
      )
    })

    return promise
  }

  load(){
    this.user = new AuthUser(this.auth.getUserFromSession())     
    this.getEvents().then(
      res =>{
        // // console.log(res)
        this.events  = res['body']['events']
      },
      err => {
        // // console.log(JSON.stringify(err))
      }
    )
  }

  ngOnInit() {
    this.load()
  }

  goto(url){
    window.open(url, '_blank')
  }

}
